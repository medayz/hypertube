const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  emailActivated: { type: Boolean, default: false },
  password: { type: String, select: false, required: true },
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

userSchema.statics.usernameExists = async username => {
  const user = await model('User').findOne({ username });

  return !!user;
};

userSchema.statics.emailExists = async email => {
  const user = await model('User').findOne({ email });

  return !!user;
};

userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);

  return compare;
};

module.exports = model('User', userSchema);
