const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/User"); // Adjust path if needed

// Serialize user by user ID into the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from the session by ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Helper to build absolute callback URLs
const SERVER_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:5000";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          oauthId: profile.id,
          provider: "google",
        });
        if (!user) {
          user = await User.create({
            oauthId: profile.id,
            provider: "google",
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${SERVER_BASE_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          oauthId: profile.id,
          provider: "facebook",
        });
        if (!user) {
          user = await User.create({
            oauthId: profile.id,
            provider: "facebook",
            name: profile.displayName,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${SERVER_BASE_URL}/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          oauthId: profile.id,
          provider: "github",
        });
        if (!user) {
          user = await User.create({
            oauthId: profile.id,
            provider: "github",
            name: profile.displayName || profile.username,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
