const userSchema = require('../validators/user');
const utils = require('../utils');
const { loadImage } = require('canvas');
const createError = require('http-errors');
const fs = require('fs');

const EmailVerification = require('../models/email-verification');
const ResetPassword = require('../models/reset-password');

exports.createValidator = (req, res, next) => {
  const { error, value } = userSchema.createUserValidator.validate(req.body);

  if (!error) {
    req.body = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.loginValidator = (req, res, next) => {
  const { error, value } = userSchema.loginUserValidator.validate(req.body);

  if (!error) {
    req.body = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.updateValidator = (req, res, next) => {
  const { error, value } = userSchema.updateUserValidator.validate(req.body);

  if (!error) {
    req.body = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.changePassword = (req, res, next) => {
  const { error, value } = userSchema.changePassword.validate(req.body);

  if (!error) {
    req.body = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.getUserByUsername = (req, res, next) => {
  const { error, value } = userSchema.getUserByUsernameValidator.validate(
    req.params
  );

  if (!error) {
    req.params = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.sendResetPassword = async (req, res, next) => {
  const { error, value } = userSchema.sendResetPassword.validate(req.params);

  if (!error) {
    req.params = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.resetPassword = async (req, res, next) => {
  const { error, value } = userSchema.resetPassword.validate(req.body);

  if (!error) {
    try {
      const decoded = await utils.verfiyToken(req.body.token);

      if (!decoded) return next(createError(400, 'invalid token'));

      const resetPassword = await ResetPassword.findOne({
        token: req.body.token
      });

      if (!resetPassword) return next(createError(400, 'invalid token'));

      req.body = {
        ...value,
        email: decoded.email
      };
      return next();
    } catch (err) {
      return next(createError(400, 'invalid token'));
    }
  }
  res.status(400).send({ error: utils.prettyError(error) });
};

exports.verify = async (req, res, next) => {
  const { error } = userSchema.verficationValidator.validate(req.params);

  if (!error) {
    try {
      const decoded = await utils.verfiyToken(req.params.token);

      if (!decoded) return next(createError(400, 'invalid token'));

      const emailVerification = await EmailVerification.findOne({
        token: req.params.token
      });

      if (!emailVerification) return next(createError(400, 'invalid token'));

      req.payload = {
        email: decoded.email
      };

      return next();
    } catch (err) {
      return next(createError(400, 'invalid token'));
    }
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.watchValidator = async (req, res, next) => {
  const { error } = userSchema.watchValidator.validate(req.params);

  if (!error) return next();

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.getImage = (req, res, next) => {
  try {
    const path = `${process.env.IMAGES_PATH}/${req.params.filename}`;

    if (!fs.existsSync(path)) return next(createError(404));

    req.imagePath = path;
    next();
  } catch (err) {
    next(err);
  }
};

exports.addImage = async (req, res, next) => {
  try {
    if (!req.file) return next(createError(400, 'Invalid image'));

    await loadImage(req.file.path);
    next();
  } catch (err) {
    if (req.file) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    next(createError(400, 'Invalid image'));
  }
};
