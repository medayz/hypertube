const movieSchema = require('../validators/movie');
const utils = require('../utils');

exports.getMoviesValidator = (req, res, next) => {
  const { error, value } = movieSchema.getMoviesValidator.validate(req.query);

  if (!error) {
    req.query = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.searchValidator = (req, res, next) => {
  const { error, value } = movieSchema.searchValidator.validate(req.query);

  if (!error) {
    req.query = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.getMovieValidator = (req, res, next) => {
  const { error } = movieSchema.getMovieValidator.validate(req.params);

  if (!error) {
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};
