const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../model/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"461079065064-0n97s81re56locdgujh42b0hsa5j6qi5.apps.googleusercontent.com", // Your Credentials here.
    clientSecret:"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", // Your Credentials here.
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done){
      
        User.findOne({email: profile.emails[0].value})
        .then((user)=>{
            // console.log(accessToken, refreshToken);
            // console.log(profile);

            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')  // crypto used to create some randome password
                })
                .then((user)=>{
                    return done(null, user); 
                })
                .catch((err)=>{
                    console.log('error in creating user google strategy-passport', err); return;
                })
            }
        })
        .catch((err)=>{
            console.log('error in google strategy-passport', err); return;
        })
    }
));
module.exports = passport;