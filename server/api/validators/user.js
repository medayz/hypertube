const Joi = require('@hapi/joi');

exports.createUserValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .required(),
  firstName: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .required(),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required(),
  password: Joi.string()
    .min(4)
    .max(100)
    .required()
});

exports.loginUserValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .required(),
  password: Joi.string()
    .min(4)
    .max(100)
    .required()
});

exports.updateUserValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase(),
  firstName: Joi.string()
    .min(3)
    .max(100)
    .trim(),
  lastName: Joi.string()
    .min(3)
    .max(100)
    .trim(),
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
});

exports.changePassword = Joi.object().keys({
  oldPassword: Joi.string()
    .min(4)
    .max(100)
    .required(),
  newPassword: Joi.string()
    .min(4)
    .max(100)
    .required()
});

exports.sendResetPassword = Joi.object().keys({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
});

exports.resetPassword = Joi.object().keys({
  token: Joi.string().required(),
  password: Joi.string()
    .min(1)
    .required()
});

exports.getUserByUsernameValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .required()
});

exports.verficationValidator = Joi.object().keys({
  token: Joi.string().required()
});

exports.watchValidator = Joi.object().keys({
  imdbid: Joi.string()
    .min(1)
    .required()
});
