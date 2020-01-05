const router = require('express').Router();
const passport = require('../middlewares/auth');

const moviesController = require('../controllers/movies');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  moviesController.getMovies
);

router.get(
  '/search',
  passport.authenticate('jwt', { session: false }),
  moviesController.searchByName
);

router.get(
  '/:provider/:id',
  passport.authenticate('jwt', { session: false }),
  moviesController.getMovie
);

module.exports = router;
