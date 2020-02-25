const { Schema, model } = require('mongoose');

const emailVerificationSchema = new Schema({
  email: { type: String, unique: true, required: true },
  token: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

emailVerificationSchema.pre('save', async function(next) {
  const EmailVerification = model('EmailVerification');
  await EmailVerification.deleteOne({ token: this.token });

  next();
});

module.exports = model('EmailVerification', emailVerificationSchema);
