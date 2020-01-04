const { createUserValidator, loginUserValidator } = require('../validators/user');

exports.createValidator = (req, res, next) => {
  const { error } = createUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({
    error: error.details.map(detail => detail.message)
  });
};

exports.loginValidator = (req, res, next) => {
  const { error } = loginUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({
    error: error.details.map(detail => detail.message)
  });
};
