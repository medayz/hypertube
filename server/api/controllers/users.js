const jwt = require('jsonwebtoken');

const User = require('../models/user');

const passport = require('../middlewares/passport');

exports.create = async (req, res, next) => {
  const user = new User(req.body);

  try {
    const usernameExists = await User.usernameExists(req.body.username);

    if (usernameExists) {
      return res.status(403).send({ message: 'username is already exists' });
    }

    const emailExists = await User.emailExists(req.body.email);

    if (emailExists) {
      return res.status(403).send({ message: 'email is already exists' });
    }

    const newUser = await user.save();

    res.status(201).send({
      message: 'User created',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return next(err);

    if (info) return res.status(401).send(info);

    const body = { _id: user._id };
    const token = jwt.sign({ user: body }, process.env.JWT_KEY);

    res.status(200).send({ token });
  })(req, res, next);
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.username) {
      const usernameExists = await User.usernameExists(req.body.username);

      if (usernameExists) {
        return res.status(403).send({ message: 'username is already exists' });
      }
    }

    if (req.body.email) {
      const emailExists = await User.emailExists(req.body.email);

      if (emailExists) {
        return res.status(403).send({ message: 'email is already exists' });
      }
    }

    let user = await User.findOne({ _id: req.user._id });

    // Check email is updated
    if (req.body.email && req.body.email !== user.email) {
      user.emailActivated = false;
    }

    // Update user object with given values
    for (const key in req.body) {
      const value = req.body[key];

      user[key] = value;
    }

    user = await user.save();

    res.status(200).send({ message: 'User updated', user });
  } catch (err) {
    next(err);
  }
};

exports.google = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile']
  })(req, res, next);
};

exports.googleCallback = (req, res) => {
  res.send({
    code: req.query.code,
    scope: req.query.scope,
  });
}
