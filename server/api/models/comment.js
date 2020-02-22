const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  movie: {
    id: { type: Schema.Types.ObjectId, required: true, ref: 'Movie' },
    imdbid: { type: String, required: true }
  },
  text: { type: String, required: true },
  votes: [
    {
      owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      value: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Comment', commentSchema);
