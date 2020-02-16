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
      "rating": { imdb | loved },
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
        obj: instance,
        enabled: true
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

  async getMovies(options = {}) {
    for (let i = 0; i < this.providers.length - 1; i++) {
      const provider = this.providers[i];
      try {
        if (!provider.enabled) continue;

        const data = await provider.obj.getMovies(options);

        return data;
      } catch (err) {
        if (provider.name == 'YTS') provider.enabled = false;
      }
    }
    return {
      count: 0,
      limit: 0,
      movies: []
    };
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
      try {
        const data = await provider.obj.search(options);

        if (data.movies.length) return data;
      } catch (err) {}
    }
    return {
      limit: 0,
      movies: []
    };
  }
}

exports.Movies = Movies;
exports.PROVIDERS = PROVIDERS;
