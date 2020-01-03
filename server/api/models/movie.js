const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
  createdAt: { type: Date, default: Date.now }
});

module.exports.Movie = model("Movie", movieSchema);
