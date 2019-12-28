const axios = require('axios');

class YTS {
  constructor() {
    this.baseUrl = 'https://yts.ag';
  }

  _prepareData(data) {
    const movies = data.data.movies || [];

    return movies.map(movie => {
      return {
        source: {
          id: movie.id,
          provider: 'YTS'
        },
        title: movie.title,
        description: movie.summary,
        rating: movie.rating,
        runtime: movie.runtime,
        year: movie.year,
        genres: movie.genres,
        poster: movie.large_cover_image,
        torrents: movie.torrents.map(torrent => ({
          torrentLink: `${this.baseUrl}/torrent/download/${torrent.hash}`,
          quality: torrent.quality,
          type: torrent.type,
          seeds: torrent.seeds,
          peers: torrent.peers
        }))
      };
    });
  }

  _sendRequest(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/api/v2/list_movies.json`, { params })
        .then(({ data }) => {
          const movies = this._prepareData(data);

          resolve(movies);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getMovies(options) {
    return this._sendRequest(options);
  }

  searchByName(name, options) {
    options.query_term = name;

    return this._sendRequest(options);
  }
}

class PopCorn {
  constructor() {
    this.baseUrl = 'https://api.apiumadomain.com';
  }

  _prepareData(data) {
    return data.MovieList.map(movie => {
      return {
        source: {
          id: movie.id,
          provider: 'POPCORN'
        },
        title: movie.title,
        description: movie.description,
        rating: movie.rating,
        runtime: movie.runtime,
        year: movie.year,
        genres: movie.genres,
        poster: movie.poster_big,
        torrents: movie.items.map(item => ({
          torrentLink: item.torrent_url,
          torrentMagnet: item.torrent_magnet,
          quality: item.quality,
          seeds: item.torrent_seeds,
          peers: item.torrent_peers
        }))
      };
    });
  }

  _sendRequest(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/list`, { params })
        .then(({ data }) => {
          const movies = this._prepareData(data);

          resolve(movies);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getMovies(options) {
    options.sort = 'seeds';

    return this._sendRequest(options);
  }

  searchByName(name, options) {
    options.quality = '720p,1080p,3d';
    options.sort = 'seeds';
    options.keywords = name;

    return this._sendRequest(options);
  }
}

exports.YTS = YTS;
exports.PopCorn = PopCorn;
