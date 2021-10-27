const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy

const dotenv = require("dotenv")
dotenv.config({path:".env"})
const {FACEBOOK_CLINT_ID,FACEBOOK_APP_SECRET} = process.env

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLINT_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // if (err) { return done(err); }
    cb(null, profile);
  }
));

