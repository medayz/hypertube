const passport = require('./passport');
const User = require('../models/user');

exports.isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (!err && user) {
      if (req.url != '/me') user = await User.findOne({ _id: user._id });
      else {
        user = await await User.findOne({ _id: user._id }).populate(
          'watchList',
          '-_id imdbid progress seenAt'
        );
      }
    }

    if (err || !user) return res.status(401).json({ message: 'Unautorized' });

    if (!user.emailVerified)
      return res.status(403).json({ message: 'Forbidden' });

    req.user = user.toJSON();
    next();
  })(req, res, next);
};
