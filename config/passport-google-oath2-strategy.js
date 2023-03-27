const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to  use a googleStrategy
passport.use(new googleStrategy({
    clientID: "673917135102-t90ogm30uii7snfb7as4jqmjd1o2fasc.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
    User.findOne({email: profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in google strategy-passport',err);
            return;
        }
        console.log(profile);

        if(user){
            //if user found
            return done(null,user);
        }else{
            //if user not found we create new user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log('error in creating user google strategy passport',err);
                    return done(null,user);
                }
            });
        }
    });
}));

module.exports = passport;