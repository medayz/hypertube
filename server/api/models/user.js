const { Schema, model } = require('mongoose');
const utils = require('../utils');
const bcrypt = require('bcryptjs');
const EmailVerifcation = require('../models/email-verification');
const ResetPassword = require('../models/reset-password');

const userSchema = new Schema({
  username: { type: String, trim: true, lowercase: true },
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  avatar: { type: String },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  password: { type: String, select: false },
  language: { type: String, required: true, default: 'en' },
  watchList: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Watch' }],
    select: false
  },
  emailVerified: { type: Boolean, default: false },
  google: { id: String },
  facebook: { id: String },
  '42': { id: String },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash the password using our new salt
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);

    // Override the cleartext password with the hashed one
    this.password = hash;
    next();
  });
});

userSchema.statics.idExists = async _id => {
  const user = await model('User').findOne({ _id });

  return !!user;
};

userSchema.statics.usernameExists = async username => {
  const user = await model('User').findOne({ username });

  return !!user;
};

userSchema.statics.emailExists = async email => {
  const user = await model('User').findOne({ email });

  return !!user;
};

userSchema.statics.verifyEmail = async email => {
  const User = model('User');

  await EmailVerifcation.deleteMany({ email });

  await User.updateOne(
    { email },
    {
      $set: { emailVerified: true }
    }
  );
  return true;
};

userSchema.statics.resetPassword = async (id, password) => {
  const User = model('User');

  await ResetPassword.deleteMany({ user: id });

  const user = await User.findOne({ _id: id });

  user.password = password;
  await user.save();

  return true;
};

userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);

  return compare;
};

userSchema.methods.googleAuth = async function() {
  const User = model('User');

  let user = await User.findOne({ 'google.id': this.google.id });

  if (!user) {
    user = await User.findOne({ email: this.email });
  }

  if (!user) {
    this.username = this._id;
    user = await this.save();
  } else {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          google: { id: this.google.id },
          emailVerified: user.emailVerified
        }
      }
    );
  }

  const payload = { _id: user._id };
  return { token: utils.generateToken(payload) };
};

userSchema.methods.fortyTwoAuth = async function() {
  const User = model('User');

  let user = await User.findOne({ '42.id': this['42'].id });

  if (!user) {
    const emailExists = await User.emailExists(this.email);

    if (emailExists) {
      return { error: { email: 'already exists' } };
    }
  }

  if (!user) {
    this.username = this._id;
    user = await this.save();
  }

  const payload = { _id: user._id };
  return { token: utils.generateToken(payload) };
};

userSchema.methods.facebookAuth = async function() {
  const User = model('User');

  let user = await User.findOne({ 'facebook.id': this.facebook.id });

  if (!user) {
    const emailExists = await User.emailExists(this.email);

    if (emailExists) {
      return { error: { email: 'already exists' } };
    }
  }

  if (!user) {
    this.username = this._id;
    user = await this.save();
  }

  const payload = { _id: user._id };
  return { token: utils.generateToken(payload) };
};

module.exports = model('User', userSchema);
