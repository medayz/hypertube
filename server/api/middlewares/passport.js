const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user');

// This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      // Secret we used to sign our JWT
      secretOrKey: process.env.JWT_KEY,
      // We expect the user to send the token as a query paramater with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        // Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
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

        if (!user) {
          // If the user isn't found in the database, return a message
          return done(null, false, { message: 'User not found' });
        }

        // Validate password and make sure it matches with the corresponding hash stored in the database
        // If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
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
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log("google")
    User.findOne({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
