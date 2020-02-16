const { Movies, PROVIDERS } = require('../helpers/torrent-apis');

module.exports = new Movies({
  providers: [PROVIDERS.YTS, PROVIDERS.TV, PROVIDERS.POPCORN]
});
