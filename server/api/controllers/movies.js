const Movie = require('../models/movie');
const movies = require('../utils/movies');
const createError = require('http-errors');
const redisClient = require('../utils/redis-client');

exports.search = async (req, res, next) => {
  try {
    const data = await movies.search(req.query);

    await redisClient.setexAsync(req.redisKey, redisClient.EXPIRE_IN, JSON.stringify(data));

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await movies.getMovie(req.params);

    if (!movie) return res.status(404).send({ message: 'resource not found' });

    await redisClient.setexAsync(req.redisKey, redisClient.EXPIRE_IN ,JSON.stringify(movie));

    res.status(200).send(movie);
  } catch (err) {
    next(err);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const result = await movies.getMovies(req.query);

    await redisClient.setexAsync(req.redisKey, redisClient.EXPIRE_IN, JSON.stringify(result));

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
    const comments = await Movie.find(req.params)
      .select('comments')
      .populate('comments.owner', 'username firstName lastName');

    res.status(200).send({
      limit: comments.length,
      comments
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
