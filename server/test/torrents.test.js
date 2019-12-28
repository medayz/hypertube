const Torrents = require('../helpers/Torrents');

const torrent = new Torrents({
  providers: ['POPCORN', 'YTS']
});

// console.log('Providers:', torrent.getProviders());

/*
  Get movie from primary provider.
*/

// torrent
//   .getMovies({
//     page: 1,
//     limit: 2
//   })
//   .then(movies => {
//     console.log(movies.length);
//   })
//   .catch(err => {
//     console.log(err);
//   });

/*
  Search by name using all given providers.
*/

torrent
  .searchByName('interstellar', { limit: 1 })
  .then(movies => {
    console.log(movies);
  })
  .catch(err => {
    console.log(err);
  });
