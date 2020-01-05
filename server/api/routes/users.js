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

module.exports = router;
