const Movie = require('../models/movie');
const movies = require('../utils/movies');

exports.search = async (req, res, next) => {
  try {
    const data = await movies.search(req.query);

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await movies.getMovie(req.params);

    if (!movie) return res.status(404).send({ message: 'resource not found' });

    res.status(200).send(movie);
  } catch (err) {
    next(err);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const result = await movies.getMovies(req.query);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {};
