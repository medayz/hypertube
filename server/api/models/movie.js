const { Schema, model } = require('mongoose');

const Watch = require('../models/watch');

const movieSchema = new Schema({
  imdbid: { type: String, unique: true, required: true },
  lastAccess: { type: Date, default: Date.now },
  comments: [
    {
      owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

movieSchema.methods.watch = async function(userId) {
  const User = model('User');

  this.lastAccess = Date.now();
  const { isNew, watch } = await Watch.add({
    movieId: this._id
  });

  if (isNew) {
    await User.updateOne(
      { _id: userId },
      {
        $push: { watchList: watch._id }
      }
    );
  }

  return await this.save();
};

movieSchema.statics.add = async function(imdbid, options) {
  const Movie = model('Movie');
  const { updateLastAccess } = options || { updateLastAccess: true };

  let movie = await Movie.findOne({ imdbid });

  if (!movie) movie = new Movie({ imdbid });
  else if (updateLastAccess) movie.lastAccess = Date.now();

  return await movie.save();
};

module.exports = model('Movie', movieSchema);
