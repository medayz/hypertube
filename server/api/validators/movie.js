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

exports.getCommentsValidator = Joi.object().keys({
  imdbid: Joi.string().required()
});

exports.addCommentValidator = Joi.object().keys({
  imdbid: Joi.string()
    .min(1)
    .max(30)
    .required(),
  text: Joi.string()
    .min(1)
    .max(500)
    .required()
});

exports.updateCommentValidator = Joi.object().keys({
  imdbid: Joi.string()
    .min(1)
    .max(30)
    .required(),
  id: Joi.string()
    .min(1)
    .max(24)
    .required(),
  text: Joi.string()
    .min(1)
    .max(500)
    .required()
});

exports.deleteCommentValidator = Joi.object().keys({
  imdbid: Joi.string()
    .min(1)
    .max(30)
    .required(),
  id: Joi.string()
    .min(1)
    .max(24)
    .required()
});

exports.voteValidator = Joi.object({
  value: Joi.string()
    .valid('up', 'down')
    .required()
});
