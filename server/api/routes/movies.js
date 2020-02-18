const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');
const moviesController = require('../controllers/movies');
const movieValidator = require('../middlewares/movie');

router.get(
  '/',
  isAuth,
  movieValidator.getMoviesValidator,
  movieValidator.cacheMovies,
  moviesController.getMovies
);

router.get(
  '/search',
  isAuth,
  movieValidator.searchValidator,
  movieValidator.cacheSearch,
  moviesController.search
);

router.get(
  '/:imdbid',
  isAuth,
  movieValidator.getMovieValidator,
  movieValidator.cacheMovie,
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

router.patch(
  '/comments/:imdbid/:id',
  isAuth,
  movieValidator.updateCommentValidator,
  moviesController.updateComment
);

router.delete(
  '/comments/:imdbid/:id',
  isAuth,
  movieValidator.deleteCommentValidator,
  moviesController.deleteComment
);

module.exports = router;
