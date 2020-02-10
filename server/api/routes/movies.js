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

router.get(
  '/search',
  isAuth,
  movieValidator.searchValidator,
  moviesController.search
);

router.get(
  '/:imdbid',
  isAuth,
  movieValidator.getMovieValidator,
  moviesController.getMovie
);

router.get(
  '/comments/:imdbid',
  isAuth,
  movieValidator.getCommentsValidator,
  moviesController.getComments
);

router.post(
  '/comments/:imdbid',
  isAuth,
  movieValidator.addCommentValidator,
  moviesController.addComment
);

// router.get('/comments/:movieid', isAuth, moviesController.getComments);

// router.delete('/comments/:id', isAuth, moviesController.deleteComment);

// router.get('/search', isAuth, moviesController.searchByName);

// router.get('/:provider/:id', isAuth, moviesController.getMovie);

module.exports = router;
