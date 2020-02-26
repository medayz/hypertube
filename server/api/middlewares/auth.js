const passport = require('./passport');
const User = require('../models/user');

exports.isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (!err && user) {
      user = await User.findOne({ _id: user._id });
    }

    if (err || !user) return res.status(401).json({ message: 'Unautorized' });

    if (!user.emailVerified)
      return res.status(403).json({ message: 'Forbidden' });

    req.user = user.toJSON();
    next();
  })(req, res, next);
};

exports.getQueryToken = (req, res, next) => {
  const token = req.query.token || '';
  req.headers.authorization = `Bearer ${token}`;
  next();
};
