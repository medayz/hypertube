const jwt = require('jsonwebtoken');

const User = require('../models/user');

const passport = require('../middlewares/auth');

exports.create = async (req, res, next) => {
  const user = new User(req.body);

  try {
    const result = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (result) {
      const key = result.username === req.body.username ? 'username' : 'email';

      return res.status(403).send({ message: `${key} is already exists` });
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
    console.log(err, user, info);

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
