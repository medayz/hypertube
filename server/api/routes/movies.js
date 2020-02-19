const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');
const moviesController = require('../controllers/movies');
const movieValidator = require('../middlewares/movie');

router.use(isAuth);

router.get(
  '/',
  movieValidator.getMoviesValidator,
  movieValidator.cacheMovies,
  moviesController.getMovies
);

router.get(
  '/search',
  movieValidator.searchValidator,
  movieValidator.cacheSearch,
  moviesController.search
);

router.get(
  '/:imdbid',
  movieValidator.getMovieValidator,
  movieValidator.cacheMovie,
  moviesController.getMovie
);

router.get(
  '/comments/:imdbid',
  movieValidator.getCommentsValidator,
  moviesController.getComments
);

router.post(
  '/comments/:imdbid',
  movieValidator.addCommentValidator,
  moviesController.addComment
);

router.patch(
  '/comments/:imdbid/:id',
  movieValidator.updateCommentValidator,
  moviesController.updateComment
);

router.delete(
  '/comments/:imdbid/:id',
  movieValidator.deleteCommentValidator,
  moviesController.deleteComment
);

module.exports = router;
