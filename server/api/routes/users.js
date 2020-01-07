const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');

const usersController = require('../controllers/users');
const userValidator = require('../middlewares/user');

router.post('/', userValidator.createValidator, usersController.create);

router.post('/login', userValidator.loginValidator, usersController.login);

router.get('/me', isAuth, usersController.me);

router.patch(
  '/',
  isAuth,
  userValidator.updateValidator,
  usersController.update
);

router.get('/auth/google', usersController.google);

router.get('/auth/google/callback', usersController.googleCallback);

// router.get('/auth/intra42', usersController.intra42);

// router.get('/auth/intra42/callback', usersController.intra42Callback);

module.exports = router;
