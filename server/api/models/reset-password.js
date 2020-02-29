const { Schema, model } = require('mongoose');

const resetPasswordSchema = new Schema({
  user: { type: String, unique: true, required: true },
  token: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

resetPasswordSchema.pre('save', async function(next) {
  const ResetPassword = model('ResetPassword');

  await ResetPassword.deleteMany({ user: this.user });

  next();
});

module.exports = model('ResetPassword', resetPasswordSchema);
