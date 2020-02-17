const userSchema = require('../validators/user');
const utils = require('../utils');
const { loadImage } = require('canvas');
const createError = require('http-errors');
const fs = require('fs');

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

exports.getUserByUsername = (req, res, next) => {
  const { error, value } = userSchema.getUserByUsernameValidator.validate(req.params);

  if (!error) {
    req.params = value;
    return next();
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.verify = async (req, res, next) => {
  const { error } = userSchema.verficationValidator.validate(req.params);

  if (!error) {
    try {
      const decoded = await utils.verfiyToken(req.params.token);

      if (!decoded.is_verification) throw new Error();

      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(400).send({ message: 'invalid token' });
    }
  }

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.watchValidator = async (req, res, next) => {
  const { error } = userSchema.watchValidator.validate(req.params);

  if (!error) return next();

  res.status(400).send({ error: utils.prettyError(error) });
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
