const axios = require('axios');
const cloudScrapper = require('cloudscraper');
const { parse: parseURL } = require('url');

class YTS {
  constructor() {
    this.baseUrl = 'https://yts.mx';
    this.imageBaseUrl = 'https://img.yts.mx';
    this.sortAccept = { rating: 'rating', title: 'title' };
  }

  _generateMagnet(hash) {
    return `magnet:?xt=urn:btih:${hash}`;
  }

  _prepareMovie(movie) {
    let poster;
    let banner;

    if (movie.large_cover_image) {
      const { path: posterPath } = parseURL(movie.large_cover_image);
      poster = `${this.imageBaseUrl}${posterPath}`;
    }
    if (movie.background_image_original) {
      const { path: bannerPath } = parseURL(movie.background_image_original);
      banner = `${this.imageBaseUrl}${bannerPath}`;
    }

    if (!movie.torrents) return null;

    const torrents = movie.torrents.map(torrent => ({
      torrentMagnet: this._generateMagnet(torrent.hash),
      quality: torrent.quality,
      type: torrent.type,
      seeds: torrent.seeds,
      peers: torrent.peers
    }));

    return {
      source: {
        provider: 'YTS'
      },
      imdbid: movie.imdb_code,
      title: movie.title,
      description: movie.summary,
      rating: { imdb: movie.rating },
      runtime: movie.runtime,
      year: movie.year,
      genres: movie.genres,
      poster: poster,
      banner: banner,
      trailer: movie.yt_trailer_code,
      torrents: torrents
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

    let movies = this._prepareData(data.movies || []);

    movies = movies.filter(item => item);

    return {
      count: data.movie_count,
      page: data.page_number,
      limit: movies.length,
      movies
    };
  }

  async getMovies(options) {
    let sort_by = this.sortAccept[options.sort_by];

    const data = await this._sendRequest('list_movies.json', {
      page: options.page,
      sort_by: sort_by,
      genre: options.genre,
      limit: 50
    });

    if (!sort_by) {
      data.movies.sort((a, b) => {
        const a_seeds = a.torrents.reduce((acc, cur) => acc + cur.seeds, 0);
        const b_seeds = b.torrents.reduce((acc, cur) => acc + cur.seeds, 0);

        return b_seeds - a_seeds;
      });
    }
    return data;
  }

  async getMovie(params) {
    const data = await this._sendRequest('list_movies.json', {
      query_term: params.imdbid
    });

    if (!data.movies.length) return null;

    return data.movies[0];
  }

  search(options) {
    return this._sendRequest('list_movies.json', {
      page: options.page,
      query_term: options.q
    });
  }
}

class TV {
  constructor() {
    this.baseUrl = 'https://tv-v2.api-fetch.website';
    this._limit = 50;
    this.sortAccept = { rating: 'rating', title: 'title' };
  }

  _getTrailerId(url) {
    try {
      if (!url) return '';

      const urlObj = new URL(url);

      return urlObj.searchParams.get('v');
    } catch (err) {
      console.log('invalid trailer url:', err.message);
      return '';
    }
  }

  _prepareMovie(movie) {
    let banner = undefined;
    let poster = undefined;

    if (movie.images.poster) {
      poster = `https://image.tmdb.org/t/p/w500/${movie.images.poster
        .split('/')
        .pop()}`;
    }

    if (movie.images.fanart) {
      banner = `https://image.tmdb.org/t/p/w1280/${movie.images.fanart
        .split('/')
        .pop()}`;
    }

    if (!movie.torrents) return null;

    return {
      source: {
        provider: 'TV'
      },
      imdbid: movie._id,
      title: movie.title,
      description: movie.synopsis,
      rating: { loved: movie.rating.percentage },
      runtime: movie.runtime,
      year: movie.year,
      genres: movie.genres,
      poster: poster,
      banner: banner,
      trailer: this._getTrailerId(movie.trailer),
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

    let movies = this._prepareData(data);

    movies = movies.filter(item => item);

    const { data: pages } = await axios.get(`${this.baseUrl}/movies`);

    const total = pages.length * this._limit;

    return {
      count: total,
      limit: movies.length,
      movies
    };
  }

  async getMovies(options = {}) {
    let sort_by = this.sortAccept[options.sort_by];

    let data = await this._sendRequest(`/movies/${options.page}`, {
      page: options.page,
      sort: sort_by,
      genre: options.genre,
      order: sort_by == 'rating' ? -1 : 1
    });

    if (!sort_by) {
      data.movies.sort((a, b) => {
        const a_seeds = a.torrents.reduce((acc, cur) => acc + cur.seeds, 0);
        const b_seeds = b.torrents.reduce((acc, cur) => acc + cur.seeds, 0);

        return b_seeds - a_seeds;
      });
    }
    return data;
  }

  async getMovie(params) {
    const data = await this._sendRequest(`/movie/${params.imdbid}`);

    if (!data.movies.length) return null;

    return data.movies[0];
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
    this.sortAccept = { seeds: 'seeds', title: 'title' };
  }

  _prepareMovie(movie) {
    let poster;

    if (movie.poster_big) {
      poster = `https://image.tmdb.org/t/p/w500/${movie.poster_big
        .split('/')
        .pop()}`;
    }

    return {
      source: {
        provider: 'POPCORN'
      },
      imdbid: movie.imdb,
      title: movie.title,
      description: movie.description,
      rating: { imdb: movie.rating },
      runtime: movie.runtime,
      year: movie.year,
      genres: movie.genres,
      trailer: movie.trailer,
      poster: poster,
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

    let movies = this._prepareData(data);

    movies = movies.filter(item => item);

    return {
      limit: movies.length,
      movies
    };
  }

  async getMovies(options) {
    let sort_by = this.sortAccept[options.sort_by];

    const data = await this._sendRequest('/list', {
      page: options.page,
      sort: sort_by,
      genre: options.genre
    });

    if (!sort_by) {
      data.movies.sort((a, b) => b.rating.imdb - a.rating.imdb);
    } else if (sort_by !== 'title') data.movies.reverse();

    return data;
  }

  async getMovie(params) {
    const data = await this._sendRequest('/movie', { imdb: params.imdbid });

    if (!data.movies.length) return null;

    return data.movies[0];
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
