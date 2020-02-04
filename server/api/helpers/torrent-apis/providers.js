const axios = require('axios');
const cloudScrapper = require('cloudscraper');
const { parse: parseURL } = require('url');

class YTS {
  constructor() {
    this.baseUrl = 'https://yts.mx';
    this.imageBaseUrl = 'https://img.yts.mx';
  }

  _prepareMovie(movie) {
    const { path } = parseURL(movie.large_cover_image);
    const poster = `${this.imageBaseUrl}${path}`;

    return {
      source: {
        imdbid: movie.imdb_code,
        provider: 'YTS'
      },
      title: movie.title,
      description: movie.summary,
      rating: { imdb: movie.rating },
      runtime: movie.runtime,
      year: movie.year,
      genres: movie.genres,
      poster: poster,
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
    return data.map(movie => this._prepareMovie(movie));
  }

  async _sendRequest(url, qs) {
    let response = null;

    for (let i = 1; i <= 2; i++) {
      response = await cloudScrapper.get(`${this.baseUrl}/api/v2/${url}`, {
        qs
      });

      response = JSON.parse(response);

      if (
        response.data.page_number == qs.page &&
        response.data.limit == qs.limit
      )
        break;
    }

    const { data } = response;

    const movies = this._prepareData(data.movies || []);

    return {
      count: data.movie_count,
      page: data.page_number,
      limit: movies.length,
      movies
    };
  }

  getMovies(options) {
    return this._sendRequest('list_movies.json', {
      page: options.page,
      limit: options.limit,
      query_term: options.q
    });
  }

  async getMovie(params) {
    const data = await this._sendRequest('list_movies.json', {
      query_term: params.imdbid
    });

    if (!data.movies.length) return null;

    return {
      movie: data.movies[0]
    };
  }

  search(options) {
    return this._sendRequest('list_movies.json', {
      page: 1,
      limit: options.limit,
      query_term: options.q
    });
  }
}

class TV {
  constructor() {
    this.baseUrl = 'https://tv-v2.api-fetch.website';
  }

  _prepareMovie(movie) {
    return {
      source: {
        imdbid: movie._id,
        provider: 'TV'
      },
      title: movie.title,
      description: movie.synopsis,
      rating: { loved: movie.rating.percentage },
      runtime: movie.runtime,
      year: movie.year,
      genres: movie.genres,
      poster: movie.images.poster,
      torrents: Object.keys(movie.torrents.en).map(key => {
        const torrent = movie.torrents.en[key];
        torrent.quality = key;

        return {
          torrentMagnet: torrent.url,
          quality: torrent.quality,
          seeds: torrent.seed,
          peers: torrent.peer
        };
      })
    };
  }

  _prepareData(data) {
    if (typeof data === 'string') return [];

    const movies = Array.isArray(data) ? data : [data];

    return movies.map(movie => this._prepareMovie(movie));
  }

  async _sendRequest(url, params = {}) {
    const { data } = await axios.get(`${this.baseUrl}${url}`, { params });

    const movies = this._prepareData(data);

    return {
      limit: movies.length,
      movies
    };
  }

  getMovies(options = {}) {
    if (!options.page) options.page = 1;

    return this._sendRequest(`/movies/${options.page}`, options);
  }

  async getMovie(params) {
    const data = await this._sendRequest(`/movie/${params.imdbid}`);

    if (!data.movies.length) return null;

    return {
      movie: data.movies[0]
    };
  }

  search(options) {
    return this._sendRequest(`/movies/${options.page}`, {
      keywords: options.q
    });
  }
}

class PopCorn {
  constructor() {
    this.baseUrl = 'https://api.apiumadomain.com';
  }

  _prepareMovie(movie) {
    return {
      source: {
        imdbid: movie.imdb,
        provider: 'POPCORN'
      },
      title: movie.title,
      description: movie.description,
      rating: { imdb: movie.rating },
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
    data = data.MovieList ? data : { MovieList: [data] };

    return data.MovieList.map(movie => this._prepareMovie(movie));
  }

  async _sendRequest(route, params) {
    const { data } = await axios.get(`${this.baseUrl}${route}`, { params });

    const movies = this._prepareData(data);

    return {
      limit: movies.length,
      movies
    };
  }

  getMovies(options) {
    options.sort = 'seeds';

    return this._sendRequest('/list', options);
  }

  async getMovie(params) {
    const data = await this._sendRequest('/movie', { imdb: params.imdbid });

    if (!data.movies.length) return null;

    return {
      movie: data.movies[0]
    };
  }

  search(options) {
    return this._sendRequest(`/list`, {
      quality: '720p,1080p,3d',
      sort: 'seeds',
      page: options.page,
      keywords: options.q
    });
  }
}

exports.TV = TV;
exports.PopCorn = PopCorn;
exports.YTS = YTS;
