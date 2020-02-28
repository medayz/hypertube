const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');

// This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      // Secret we used to sign our JWT
      secretOrKey: process.env.JWT_KEY,
      // We expect the user to send the token as a query paramater with the name 'secret_token'
      jwtFromRequest: req => {
        const token = req.cookies.token;
        return token;
      }
    },
    (payload, done) => {
      try {
        // Pass the user details to the next middleware
        done(null, payload);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Create a passport middleware to handle User login
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Find the user associated with the username provided by the user
        const user = await User.findOne({ username }).select('+password');

        // If the user isn't found in the database, return a message
        if (!user) {
          return done(null, false, { username: 'User not found' });
        }

        // Validate password and make sure it matches with the corresponding hash stored in the database
        // If the passwords match, it returns a value of true.
        let validate = false;
        if (password) validate = await user.isValidPassword(password);

        if (!validate) return done(null, false, { password: 'Wrong Password' });

        // Verify if user email activated
        if (!user.emailVerified) {
          return done(null, false, { email: 'email not verified' });
        }

        // Send the user information to the next middleware
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/users/auth/google/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
      const email = profile.emails[0];

      try {
        const data = await new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: email.value,
          emailVerified: true,
          google: { id: profile.id }
        }).googleAuth();
        return done(null, data);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FortyTwoStrategy(
    {
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: '/api/v1/users/auth/42/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
      const email = profile.emails[0];

      try {
        const data = await new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: email.value,
          emailVerified: true,
          '42': { id: profile.id }
        }).fortyTwoAuth();
        return done(null, data);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/v1/users/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name']
    },
    async function(accessToken, refreshToken, profile, done) {
      const email = profile.emails[0];

      try {
        const data = await new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: email.value,
          emailVerified: true,
          facebook: { id: profile.id }
        }).facebookAuth();
        return done(null, data);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
