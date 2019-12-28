const { YTS, PopCorn } = require('./providers');

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

class Torrents {
  constructor(options = { providers: ['YTS'] }) {
    this.providers = this._setProviders(options.providers);
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
      case 'POPCORN':
        return new PopCorn();

      case 'YTS':
        return new YTS();

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

  searchByName(name, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        for (const provider of this.providers) {
          const movies = await provider.obj.searchByName(name, options);

          if (movies.length) return resolve(movies);
        }

        resolve([]);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Torrents;
