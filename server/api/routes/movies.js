const router = require("express").Router();
const { Torrents } = require("../helpers/torrent-apis");

const PROVIDERS = {
  POPCORN: 0
};

const torrent = new Torrents({
  providers: ["POPCORN"]
});

router.get("/", (req, res, next) => {
  torrent
    .getMovies()
    .then(movies => res.json(movies))
    .catch(err => res.json(err));
});

router.get("/:provider/:id", (req, res, next) => {
  torrent
    .getMovie(req.params.id, PROVIDERS[req.params.provider])
    .then(movies => res.json(movies))
    .catch(err => res.json(err));
});

module.exports = router;
