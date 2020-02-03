const Joi = require('@hapi/joi');

exports.getMoviesValidator = Joi.object().keys({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.string().default(50),
  q: Joi.string().default('')
});
