const router = require('express').Router();
const Movie = require('../models/movie');
const removeMovieDir = require('../utils/removeMovieDir');
const MovieStream = require('../helpers/MovieStream');
const movies = require('../utils/movies');
const createError = require('http-errors');
const { isAuth } = require('../middlewares/auth');

const movieStream = new MovieStream(
  {
    clientSupportedFormat: ['mp4', 'mkv', 'webm'],
    convert: true, // To webm
    verbose: true
  },
  async sender => {
    const now = new Date();
    now.setDate(now.getDate() - 30);

    const movies = await Movie.find({
      lastAccess: { $lte: now }
    }).select('imdbid lastAccess');

    movies.forEach(movie => {
      removeMovieDir(movie.imdbid)
        .then(() => {
          const pattern = new RegExp(`${movie.imdbid}-.+`);
          sender.destroyEngines(pattern);
        })
        .catch(err => console.log(err.message));
    });
  }
);

movieStream.on('access', async ({ imdbid }) => {
  try {
    await Movie.updateOne({ imdbid }, { $set: { lastAccess: Date.now() } });
  } catch (err) {
    console.log(err.message);
  }
});

router.get('/:imdbid/:quality', isAuth);

router.get('/:imdbid/:quality', async (req, res, next) => {
  const { imdbid, quality } = req.params;

  try {
    let data = movieStream.get(imdbid, quality);

    if (!data) {
      const torrent = await movies.getMagnets({ imdbid, quality });

      if (!torrent) return next(createError(404));

      req.movieData = {
        ...req.params,
        magnet: torrent.torrentMagnet,
        range: req.headers.range
      };
      return next();
    }
    req.movieData = {
      ...req.params,
      range: req.headers.range
    };
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/:imdbid/:quality', async (req, res, next) => {
  try {
    const { head, stream } = await movieStream.fromMagnet(req.movieData);

    console.log('[STREAM]', 'New stream');

    res.writeHead(206, head);

    stream.pipe(res);
  } catch (err) {
    res.status(400).send({
      message: err.message
    });
  }
});

module.exports = router;
