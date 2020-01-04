const { Schema, model } = require('mongoose');

const watchListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  movies: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now }
});

module.exports.watchListSchema = model('watchlist', watchListSchema);
