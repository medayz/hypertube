const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');

const usersController = require('../controllers/users');
const userValidator = require('../middlewares/user');
const { upload, multerError } = require('../middlewares/upload');

router.post('/', userValidator.createValidator, usersController.create);

router.post(
  '/login',
  userValidator.loginValidator,
  usersController.login,
  usersController.authToken
);

router.get('/me', isAuth, usersController.me);

router.patch(
  '/',
  isAuth,
  userValidator.updateValidator,
  usersController.update
);

router.patch(
  '/password',
  isAuth,
  userValidator.changePassword,
  usersController.changePassword
);

router.get(
  '/avatar/:filename',
  isAuth,
  userValidator.getImage,
  usersController.getImage
);

router.post(
  '/avatar',
  isAuth,
  upload,
  userValidator.addImage,
  usersController.addImage,
  multerError
);

router.post(
  '/watch/:imdbid',
  isAuth,
  userValidator.watchValidator,
  usersController.watch
);

router.get(
  '/:username',
  userValidator.getUserByUsername,
  usersController.getUserByUsername
);

router.get(
  '/resetpassword/:username',
  userValidator.sendResetPassword,
  usersController.sendResetPassword
);

router.post(
  '/resetpassword',
  userValidator.resetPassword,
  usersController.resetPassword
);

router.get(
  '/verification/:token',
  userValidator.verify,
  usersController.verify
);

router.get('/auth/google', usersController.google);

router.get(
  '/auth/google/callback',
  usersController.googleCallback,
  usersController.oauthToken
);

router.get('/auth/42', usersController.fortyTwo);

router.get(
  '/auth/42/callback',
  usersController.fortyTwoCallback,
  usersController.oauthToken
);

router.get('/auth/facebook', usersController.facebook);

router.get(
  '/auth/facebook/callback',
  usersController.facebookCallback,
  usersController.oauthToken
);

module.exports = router;
