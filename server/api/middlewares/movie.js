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
