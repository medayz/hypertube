const { Schema, model } = require('mongoose');

const Watch = require('../models/watch');

const movieSchema = new Schema({
  imdbid: { type: String, unique: true, required: true },
  lastAccess: { type: Date, default: Date.now },
  subtitles: [
    {
      lang: { type: String, required: true },
      langShort: { type: String, required: true },
      fileName: { type: String, required: true }
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Comment'
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

movieSchema.methods.watch = async function(userId, progress) {
  const User = model('User');

  this.lastAccess = Date.now();
  const { isNew, watch } = await Watch.add({
    movieId: this._id,
    progress: progress
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

movieSchema.statics.add = async function(imdbid, progress, options) {
  const Movie = model('Movie');
  const { updateLastAccess } = options || { updateLastAccess: true };

  let movie = await Movie.findOne({ imdbid });

  if (!movie) movie = new Movie({ imdbid });
  else if (updateLastAccess) {
    movie.progress = progress;
    movie.lastAccess = Date.now();
  }

  return await movie.save();
};

module.exports = model('Movie', movieSchema);
