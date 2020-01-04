const Joi = require('@hapi/joi');

exports.createUserValidator = Joi.object().keys({
  fullName: Joi.string()
    .min(3)
    .max(100)
    .required(),
  username: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .max(100)
    .required()
});

exports.loginUserValidator = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string()
    .min(4)
    .max(100)
    .required()
});
