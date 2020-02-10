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

exports.getCommentsValidator = (req, res, next) => {
  const { error } = movieSchema.getCommentsValidator.validate(req.params);

  if (!error) {
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.addCommentValidator = (req, res, next) => {
  const { error, value } = movieSchema.addCommentValidator.validate({
    ...req.params,
    ...req.body
  });

  if (!error) {
    req.body = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.deleteCommentValidator = (req, res, next) => {
  const { error } = movieSchema.deleteCommentValidator.validate(req.params);

  if (!error) {
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};
