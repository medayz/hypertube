const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
  imdbid: { type: String, unique: true, required: true },
  provider: { type: String },
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

movieSchema.methods.watch = async function() {
  const Movie = model('Movie');

  const movie = await Movie.findOne({ imdbid: this.imdbid });

  if (!movie) return this.save();

  movie.lastAccess = Date.now();

  return await movie.save();
};

module.exports = model('Movie', movieSchema);
