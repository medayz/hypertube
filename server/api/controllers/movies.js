const Movie = require('../models/movie');
const Comment = require('../models/comment');
const movies = require('../utils/movies');
const createError = require('http-errors');
const redisClient = require('../utils/redis-client');
const subtitles = require('../utils/subtitles');
const fs = require('fs');

exports.search = async (req, res, next) => {
  try {
    const data = await movies.search(req.query);

    await redisClient.setexAsync(
      req.redisKey,
      redisClient.EXPIRE_IN,
      JSON.stringify(data)
    );

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await movies.getMovie(req.params);

    if (!movie) return next(createError(404));

    const dbMovie = await Movie.add(movie.imdbid, {
      updateLastAccess: false
    });

    let subs = dbMovie.subtitles;
    if (subs.length == 0) {
      subs = await subtitles.get(movie.imdbid);

      await Movie.updateOne(
        { imdbid: movie.imdbid },
        {
          $set: { subtitles: subs }
        }
      );
    }

    movie.subtitles = subs.map(item => ({
      lang: item.lang,
      langShort: item.langShort,
      isDefault: item.langShort == req.user.defaultLanguage
    }));

    await redisClient.setexAsync(
      req.redisKey,
      redisClient.EXPIRE_IN,
      JSON.stringify({ movie })
    );

    res.status(200).send({ movie });
  } catch (err) {
    next(err);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const result = await movies.getMovies(req.query);

    await redisClient.setexAsync(
      req.redisKey,
      redisClient.EXPIRE_IN,
      JSON.stringify(result)
    );

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ imdbid: req.params.imdbid }).select(
      '_id imdbid'
    );

    if (!movie) return next(createError(404));

    const newComment = new Comment({
      owner: req.user._id,
      movie: {
        id: movie._id,
        imdbid: movie.imdbid
      },
      text: req.body.text
    });

    const comment = await newComment.save();
    res.status(201).send({
      _id: comment._id,
      owner: comment.owner,
      movie: comment.movie,
      text: comment.text
    });
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      'movie.imdbid': req.params.imdbid
    }).populate('owner', 'username firstName lastName');

    res.status(200).send({
      limit: comments.length,
      comments: comments
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { nModified } = await Comment.updateOne(
      {
        'movie.imdbid': req.params.imdbid,
        _id: req.params.id
      },
      {
        $set: { text: req.body.text }
      }
    );

    if (nModified == 0) return next(createError(404));

    res.status(200).send({
      message: 'Comment updated'
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { deletedCount } = await Comment.deleteOne({
      'movie.imdbid': req.params.imdbid,
      _id: req.params.id
    });

    if (deletedCount == 0) return next(createError(404));

    res.status(200).send({
      message: 'Comment deleted'
    });
  } catch (err) {
    next(err);
  }
};

exports.voteComment = async (req, res, next) => {
  try {
    let comment = await Comment.findOne({
      _id: req.params.id
    });
    let changed = true;

    if (!comment) return next(createError(404));

    const value = req.body.value == 'up' ? 1 : -1;

    const vote = comment.votes.find(item => item.owner == req.user.id);
    if (!vote) {
      comment.votes.push({
        owner: req.user.id,
        value: value
      });
    } else {
      changed = vote.value != value;
      vote.value = value;
    }

    if (changed) comment = await comment.save();

    res.status(200).send({
      message: `Comment ${req.body.value} voted`,
      changed: changed
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubtitle = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      imdbid: req.params.imdbid
    }).select('-_id imdbid subtitles');

    let subtitle = null;

    if (movie) {
      subtitle = movie.subtitles.find(
        item => item.langShort == req.params.lang
      );
    }

    if (!subtitle) return next(createError(404));

    const path = `${process.env.MOVIES_PATH}/${movie.imdbid}/${subtitle.fileName}`;

    if (!fs.existsSync(path)) await subtitles.get(req.params.imdbid);

    if (!fs.existsSync(path)) return next(createError(404));

    const stream = fs.createReadStream(path);

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
