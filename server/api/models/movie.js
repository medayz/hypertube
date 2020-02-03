const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
  imdbId: { type: String, unique: true, required: true },
  filename: { type: String, required: true, default: 'null' },
  lastAccess: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

movieSchema.pre('save', function() {});

module.exports = model('Movie', movieSchema);
