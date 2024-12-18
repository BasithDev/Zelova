const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            isGoogleID:true,
            password: null,
          });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;