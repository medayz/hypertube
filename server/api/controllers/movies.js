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
      isDefault: item.langShort == req.user.language
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
    let comments = await Comment.find({
      'movie.imdbid': req.params.imdbid
    }).populate('owner', '_id username firstName lastName avatar');

    comments = comments.map(comment => {
      const currentUserVote = comment.votes.find(vote =>
        vote.owner.equals(req.user._id)
      );

      let userVote = 0;

      if (currentUserVote) userVote = currentUserVote.value;

      const votes = comment.votes.reduce((acc, vote) => acc + vote.value, 0);

      return {
        _id: comment._id,
        owner: {
          username: comment.owner.username,
          avatar: comment.owner.avatar
        },
        text: comment.text,
        createdAt: comment.createdAt,
        userVote: userVote,
        votes: votes
      };
    });

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

    let value = 0;
    if (req.body.value != 'regret') value = req.body.value == 'up' ? 1 : -1;

    const vote = comment.votes.find(item => item.owner.equals(req.user._id));
    if (!vote) {
      comment.votes.push({
        owner: req.user._id,
        value: value
      });
    } else {
      changed = vote.value != value;
      vote.value = value;
    }

    if (changed) comment = await comment.save();

    const votes = comment.votes.reduce((acc, vote) => acc + vote.value, 0);

    res.status(200).send({
      message: `Comment voted`,
      votes: votes
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
