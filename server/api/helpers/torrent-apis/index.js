const { TV, PopCorn, YTS } = require('./providers');

const PROVIDERS = {
  YTS: 'YTS',
  TV: 'TV',
  POPCORN: 'POPCORN'
};

/*
  Data structure:
    {
      "source": {
        "id": int,
        "name": string
      },
      "title": string,
      "description": string,
      "rating": int,
      "runtime": int,
      "year": int,
      "genres": [string],
      "poster": string,
      "torrents": [
        {
          "torrentLink": string,
          "torrentMagnet": string,
          "quality": string,
          "type": string,
          "seeds": int,
          "peers": int
        }
      ]
    }
*/

class Movies {
  constructor(options = { providers: ['TV'] }) {
    this.providers = this._setProviders(options.providers);
  }

  _getProvider(name) {
    const provider = this.providers.find(item => item.name === name);

    return provider || null;
  }

  _setProviders(providers) {
    providers = providers.map(provider => {
      const instance = this._getProviderInstance(provider);

      if (!instance) throw { message: 'Unknown Provider' };

      return {
        name: provider,
        obj: instance
      };
    });

    return providers;
  }

  _getProviderInstance(name) {
    switch (name) {
      case 'YTS':
        return new YTS();
      case 'POPCORN':
        return new PopCorn();

      case 'TV':
        return new TV();

      default:
        return null;
    }
  }

  getProviders() {
    return this.providers.map(provider => provider.name);
  }

  getMovies(options = {}) {
    const mainProvider = this.providers[0];

    return mainProvider.obj.getMovies(options);
  }

  async getMovie(params, providerName = null) {
    if (providerName) {
      const provider = this._getProvider(providerName);

      return provider.obj.getMovie(params);
    }

    for (const provider of this.providers) {
      try {
        const movie = await provider.obj.getMovie(params);

        if (movie) return movie;
      } catch (err) {}
    }
    return null;
  }

  async search(options = {}) {
    for (const provider of this.providers) {
      const data = await provider.obj.search(options);

      if (data.movies.length) return data;
    }
    return {
      limit: 0,
      movies: []
    };
  }
}

exports.Movies = Movies;
exports.PROVIDERS = PROVIDERS;
