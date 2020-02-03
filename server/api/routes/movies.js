const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');
const moviesController = require('../controllers/movies');
const movieValidator = require('../middlewares/movie');

router.get(
  '/',
  isAuth,
  movieValidator.getMoviesValidator,
  moviesController.getMovies
);

// router.get('/:id', isAuth, moviesController.getMovie);

// router.post('/comments/:movieid', isAuth, moviesController.addComment);

// router.get('/comments/:movieid', isAuth, moviesController.getComments);

// router.delete('/comments/:id', isAuth, moviesController.deleteComment);

// router.get('/search', isAuth, moviesController.searchByName);

// router.get('/:provider/:id', isAuth, moviesController.getMovie);

module.exports = router;
