const router = require('express').Router();
const MovieStream = require('../helpers/MovieStream');
const movies = require('../utils/movies');
const createError = require('http-errors');
const { isAuth, getQueryToken } = require('../middlewares/auth');

const movieStream = new MovieStream({
  clientSupportedFormat: ['mp4', 'mkv', 'webm'],
  convert: true, // To webm
  verbose: true
});

router.use(getQueryToken);

router.get('/:imdbid/:quality', isAuth);

router.get('/:imdbid/:quality', async (req, res, next) => {
  const { imdbid, quality } = req.params;

  try {
    let data = movieStream.get(imdbid, quality);

    if (!data) {
      let movie = await movies.getMovie({ imdbid });

      if (!movie) return next(createError(404));

      movie = movie.movie;

      const torrent = movie.torrents.find(item => item.quality === quality);

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
    console.log(err);
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
