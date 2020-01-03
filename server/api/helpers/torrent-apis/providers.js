const axios = require("axios");

class YTS {
  constructor() {
    this.baseUrl = "https://yts.ag";
  }

  _prepareMovie(movie) {
    return {
      source: {
        id: movie.id,
        provider: "YTS"
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
  }

  _prepareData(data) {
    const movies = data.data.movies || [];

    return movies.map(movie => this._prepareMovie(movie));
  }

  _sendRequest(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/api/v2/${url}`, { params })
        .then(({ data }) => {
          if (!Array.isArray(data))
            return resolve(this._prepareMovie(data));

          const movies = this._prepareData(data);

          resolve(movies);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getMovies(options) {
    return this._sendRequest("list_movies.json", options);
  }

  getMovie(movieId) {
    const options = {
      movie_id: movieId
    };

    return this._sendRequest("movie_details.json", options);
  }

  searchByName(name, options) {
    options.query_term = name;

    return this._sendRequest(options);
  }
}

class PopCorn {
  constructor() {
    this.baseUrl = "https://api.apiumadomain.com";
  }

  _prepareMovie(movie) {
    return {
      source: {
        id: movie.imdb,
        provider: "POPCORN"
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
  }

  _prepareData(data) {
    return data.MovieList.map(movie => this._prepareMovie(movie));
  }

  _sendRequest(route, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}${route}`, { params })
        .then(({ data }) => {
          if (!Array.isArray(data)) return resolve(this._prepareMovie(data));

          const movies = this._prepareData(data);

          resolve(movies);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getMovies(options) {
    options.sort = "seeds";

    return this._sendRequest("/list", options);
  }

  getMovie(imdbId) {
    const options = {
      imdb: imdbId
    };

    return this._sendRequest("/movie", options);
  }

  searchByName(name, options) {
    options.quality = "720p,1080p,3d";
    options.sort = "seeds";
    options.keywords = name;

    return this._sendRequest(options);
  }
}

exports.YTS = YTS;
exports.PopCorn = PopCorn;
