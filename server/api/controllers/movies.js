const Movie = require('../models/movie');
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
      langShort: item.langShort
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
    let result = await Movie.updateOne(
      { imdbid: req.body.imdbid },
      {
        $push: { comments: { owner: req.user._id, text: req.body.text } }
      }
    );

    if (result.n == 0) return next(createError(404));

    res.status(200).send({ message: 'Success' });
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const movie = await Movie.findOne(req.params)
      .select('comments')
      .populate('comments.owner', '-_id username');

    if (!movie) return next(createError(404));

    res.status(200).send({
      limit: movie.comments.length,
      comments: movie.comments
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const result = await Movie.updateOne(
      { imdbid: req.body.imdbid, 'comments._id': req.body.id },
      {
        $set: { 'comments.$.text': req.body.text }
      }
    );

    if (result.nModified === 0) return next(createError(404));

    res.status(200).send({ message: 'Success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const result = await Movie.updateOne(
      { imdbid: req.params.imdbid },
      {
        $pull: { comments: { _id: req.params.id } }
      }
    );

    if (result.nModified === 0) return next(createError(404));

    res.status(200).send({ message: 'Success' });
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

    if (movie)
      subtitle = movie.subtitles.find(
        item => item.langShort == req.params.lang
      );

    if (!subtitle) return next(createError(404));

    const path = `${process.env.MOVIES_PATH}/${movie.imdbid}/${subtitle.fileName}`;

    if (!fs.existsSync(path)) return next(createError(404));

    const stream = fs.createReadStream(path);

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
