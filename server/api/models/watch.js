const { Schema, model } = require('mongoose');

const watchSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, required: true, ref: 'Movie' },
  progress: { type: Number, required: true },
  seenAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

watchSchema.statics.add = async function(body) {
  const Watch = model('Watch');
  let isNew = true;

  let watch = await Watch.findOne({ movieId: body.movieId });

  if (!watch) watch = new Watch(body);
  else {
    isNew = false;
    if (watch.progress < body.progress) {
      watch.progress = body.progress;
      watch.seenAt = Date.now();
    }
  }

  const newWatch = await watch.save();
  return { isNew, watch: newWatch };
};

module.exports = model('Watch', watchSchema);
