const passport = require("passport")
const User = require("../models/User")
const GoogleStrategy = require("passport-google-oauth2").Strategy
const dotenv = require("dotenv")
dotenv.config({path:".env"})
const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = process.env


passport.use( new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:"http://127.0.0.1:3000/auth/google/callback",
    passReqToCallback:true
}, function (req,accessToken ,refreshToken,profile,cb){
    const defaultUser = {
        firstName : `${profile.name.givenName} ${profile.name.familyName}`,
        email:profile.emails[0].value,
        picture:profile.photos[0].value,
        googleId:profile.id
    }
    cb(null,profile)
   
}))


passport.serializeUser(function(user,done){
    done(null,user)
})

passport.deserializeUser(function(user,done){
    done(null,user)
})