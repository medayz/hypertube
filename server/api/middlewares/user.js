const userSchema = require('../validators/user');

exports.createValidator = (req, res, next) => {
  const { error } = userSchema.createUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({ error: prettyErrors(error) });
};

exports.loginValidator = (req, res, next) => {
  const { error } = userSchema.loginUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({ error: prettyErrors(error) });
};

exports.updateValidator = (req, res, next) => {
  const { error } = userSchema.updateUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({ error: prettyErrors(error) });
};

function prettyErrors(error) {
  const errors = {};

  error.details.forEach(item => {
    errors[item.context.key] = item.message;
  });

  return errors;
}

exports.getUserByUsername = (req, res, next) => {
  const { error } = userSchema.getUserByUsername.validate(req.params);

  if (!error) return next();

  res.status(400).send({ error: prettyErrors(error) });
};
