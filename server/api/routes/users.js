const router = require('express').Router();
const passport = require('../middlewares/auth');

const usersController = require('../controllers/users');
const { createValidator, loginValidator } = require('../middlewares/user');

router.post('/', createValidator, usersController.create);

router.post('/login', loginValidator, usersController.login);

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  usersController.me
);

module.exports = router;
