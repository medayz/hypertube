const passport = require('./passport');

exports.isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};
