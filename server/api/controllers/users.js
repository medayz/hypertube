const { sendEmail } = require('../utils/email');
const { generateToken, verfiyToken } = require('../utils/jwt');
const fs = require('fs');

const ResetPassword = require('../models/reset-password');
const EmailVerification = require('../models/email-verification');
const User = require('../models/user');
const Movie = require('../models/movie');

const passport = require('../middlewares/passport');

exports.create = async (req, res, next) => {
  const user = new User(req.body);

  try {
    const usernameExists = await User.usernameExists(req.body.username);

    if (usernameExists) {
      if (usernameExists) {
        return res.status(400).send({
          message: 'Validation fails',
          details: { username: 'username is already exists' }
        });
      }
    }

    const emailExists = await User.emailExists(req.body.email);

    if (emailExists) {
      if (usernameExists) {
        return res.status(400).send({
          message: 'Validation fails',
          details: { username: 'email is already exists' }
        });
      }
    }

    const newUser = await user.save();

    // insert email verifcation token
    const token = generateToken({ email: req.body.email });
    const emailVerification = new EmailVerification({
      email: req.body.email,
      token: token
    });

    await sendEmail(
      process.env.EMAIL,
      req.body.email,
      'Account activation',
      `
      ${process.env.HOSTNAME}/api/v1/users/verification/${token}<br/>
      <a href="${process.env.HOSTNAME}/api/v1/users/verification/${token}">Verify</a>
      `
    );

    await emailVerification.save();

    res.status(201).send({
      message: 'User created',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return next(err);

    if (info) {
      return res.status(401).send({
        message: 'Cannot login',
        details: {
          info
        }
      });
    }

    const payload = { _id: user._id };
    const token = generateToken(payload);

    req.user = token;
    next();
  })(req, res, next);
};

exports.me = (req, res, next) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-_id')
      .select('username')
      .select('firstName')
      .select('lastName')
      .select('avatar');

    if (!user) return res.status(404).send({ message: 'User not found' });

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    let emailChanged = false;

    if (req.body.username && req.body.username != req.user.username) {
      const usernameExists = await User.usernameExists(req.body.username);

      if (usernameExists) {
        return res.status(400).send({
          message: 'Validation fails',
          details: { username: 'username is already exists' }
        });
      }
    }

    if (req.body.email && req.body.email != req.user.email) {
      const emailExists = await User.emailExists(req.body.email);

      if (emailExists) {
        return res.status(400).send({
          message: 'Validation fails',
          details: { username: 'email is already exists' }
        });
      }
    }

    let user = await User.findOne({ _id: req.user._id });

    // Check email is updated
    if (req.body.email && req.body.email !== user.email) {
      user.emailVerified = false;
      emailChanged = true;

      // insert email verifcation token
      const token = generateToken({ email: req.body.email });
      const emailVerification = new EmailVerification({
        email: req.body.email,
        token: token
      });

      // Send email validation
      await sendEmail(
        process.env.EMAIL,
        req.body.email,
        'Account activation',
        `
        ${process.env.HOSTNAME}/api/v1/users/verification/${token}<br/>
        <a href="${process.env.HOSTNAME}/api/v1/users/verification/${token}">Verify</a>
        `
      );

      await emailVerification.save();
    }

    // Update user object with given values
    for (const key in req.body) {
      const value = req.body[key];

      user[key] = value;
    }

    user = await user.save();

    res
      .status(200)
      .send({ message: 'User updated', emailChanged: emailChanged });
  } catch (err) {
    next(err);
  }
};

exports.sendResetPassword = async (req, res, next) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).send({
        message: 'Cannot send email',
        details: {
          email: 'email non exists'
        }
      });
    }

    const token = generateToken({ email });

    const resetPassword = new ResetPassword({
      email,
      token
    });

    const result = await resetPassword.save();

    const info = await sendEmail(
      process.env.EMAIL,
      email,
      'Reset password',
      `
      ${process.env.HOSTNAME}/api/v1/users/resetpassword/${token}<br/>
      <a href="${process.env.HOSTNAME}/api/v1/users/resetpassword/${token}">Verify</a>
      `
    );
    res.status(200).send({ message: 'Reset password was sent to your email' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    await User.resetPassword(email, password);

    res.status(200).send({
      message: 'Success',
      details: {
        password: 'password changed'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { email } = req.payload;

    const verified = await User.verifyEmail(email);

    if (!verified) {
      return res.status(422).send({
        message: 'Cannot verfiy your account'
      });
    }

    res.status(200).send({ message: 'user verified' });
  } catch (err) {
    next(err);
  }
};

exports.watch = async (req, res, next) => {
  try {
    let movie = await Movie.findOne(req.params);

    if (!movie) return res.status(404).send({ message: 'resource not found' });

    await movie.watch(req.user._id);
    res.status(200).send({ message: 'Success' });
  } catch (err) {
    next(err);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const stream = fs.createReadStream(req.imagePath);

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};

exports.addImage = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { avatar: req.file.filename } }
    );

    if (req.user.avatar !== undefined) {
      fs.unlinkSync(`${process.env.IMAGES_PATH}/${req.user.avatar}`);
    }

    res.status(201).send({
      message: 'Success',
      filename: req.file.filename
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    let user = await User.findOne({ _id: req.user._id }).select('+password');

    const isValid = await user.isValidPassword(oldPassword);
    if (!isValid) {
      return res.status(422).send({
        message: 'Cannot change password',
        details: {
          password: 'old password is incorrect'
        }
      });
    }

    user.password = newPassword;
    user = await user.save();

    res.send(user);
  } catch (err) {
    next(err);
  }
};

exports.google = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleCallback = passport.authenticate('google', { session: false });

exports.fortyTwo = passport.authenticate('42');

exports.fortyTwoCallback = passport.authenticate('42', {
  session: false
});

exports.facebook = passport.authenticate('facebook', {
  scope: ['email']
});

exports.facebookCallback = passport.authenticate('facebook', {
  session: false
});

exports.authToken = (req, res) => {
  res
    .status(200)
    .cookie('token', req.user, { httpOnly: true })
    .send({ message: 'OK' });
};
