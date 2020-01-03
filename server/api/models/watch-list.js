const { Schema, model } = require("mongoose");

const watchListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  movies: [
    {
      id: { type: Number, required: true },
      provider: {
        enum: ["YTS", "POPCORN"],
        required: true
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports.watchListSchema = model("watchlist", watchListSchema);
