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
        magnet:
        'magnet:?xt=urn:btih:C05570C23D834FD47AF4BD35DBE0F6BD4BD37B90&dn=All+Yours+%282016%29+Hallmark+720p+WEB-DL+%28DDP+2.0%29+X264+Solar&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.si%3A1337%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Fdenis.stalker.upeer.me%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce',
        // magnet: torrent.torrentMagnet,
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
