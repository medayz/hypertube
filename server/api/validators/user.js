const Joi = require('@hapi/joi');

const usernameRegex = /^[a-z0-9_@-]{2,100}$/i;
const nameRegex = /^[a-z0-9_ -]{2,100}$/i;
const passwordRegex = /^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,30}$/;

const usernameMessage =
  'username accept only (a-z, 0-9, _, @, -) and a length between 2 and 100';
const nameMessage = '{{#label}} accept only (a-z, 0-9, _, -, ( )space) and a length between 2 and 100';
const passwordMessage = 'password must have (a-z, A-Z, 0-9 and one symbol) with a length between 8 and 30';

exports.createUserValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .pattern(usernameRegex)
    .messages({
      'string.pattern.base': usernameMessage
    })
    .required(),
  firstName: Joi.string()
    .trim()
    .pattern(nameRegex)
    .messages({
      'string.pattern.base': nameMessage
    })
    .required(),
  lastName: Joi.string()
    .trim()
    .pattern(nameRegex)
    .messages({
      'string.pattern.base': nameMessage
    })
    .required(),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .messages({
      'string.pattern.base': passwordMessage
    })
    .required()
});

exports.loginUserValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .pattern(usernameRegex)
    .messages({
      'string.pattern.base': usernameMessage
    })
    .required(),
  password: Joi.string()
    .max(100)
    .required()
});

exports.updateUserValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .pattern(usernameRegex)
    .messages({
      'string.pattern.base': usernameMessage
    })
    .lowercase(),
  firstName: Joi.string()
    .pattern(nameRegex)
    .messages({
      'string.pattern.base': nameMessage
    })
    .trim(),
  lastName: Joi.string()
    .pattern(nameRegex)
    .messages({
      'string.pattern.base': nameMessage
    })
    .trim(),
  email: Joi.string()
    .trim()
    .email()
    .lowercase(),
  language: Joi.string().valid('en', 'ar', 'fr', 'es')
});

exports.changePassword = Joi.object().keys({
  oldPassword: Joi.string()
    .pattern(passwordRegex)
    .messages({
      'string.pattern.base': passwordMessage
    })
    .required(),
  newPassword: Joi.string()
    .pattern(passwordRegex)
    .messages({
      'string.pattern.base': passwordMessage
    })
    .required()
});

exports.sendResetPassword = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .pattern(usernameRegex)
    .messages({
      'string.pattern.base': usernameMessage
    })
    .required()
});

exports.resetPassword = Joi.object().keys({
  token: Joi.string().required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .messages({
      'string.pattern.base': passwordMessage
    })
    .required()
});

exports.getUserByUsernameValidator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .lowercase()
    .pattern(usernameRegex)
    .messages({
      'string.pattern.base': usernameMessage
    })
    .required()
});

exports.verficationValidator = Joi.object().keys({
  token: Joi.string().required()
});

exports.watchValidator = Joi.object().keys({
  imdbid: Joi.string()
    .min(1)
    .required(),
  progress: Joi.number()
    .integer()
    .min(5)
    .max(100)
    .required()
});
