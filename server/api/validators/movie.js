const Joi = require('@hapi/joi');

exports.getMoviesValidator = Joi.object().keys({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .default(50)
});

exports.searchValidator = Joi.object().keys({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .default(50),
  q: Joi.string()
    .min(1)
    .required()
});

exports.getMovieValidator = Joi.object().keys({
  imdbid: Joi.string().required()
});
