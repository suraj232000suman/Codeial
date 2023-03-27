const passport =require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial' //encryption Key
}

//we are fetching it from payload and verifyimg it
//telling passport to use this strategy 
passport.use(new JwtStrategy(opts,function(jwtPayload,done){
    User.findById(jwtPayload._id,function(err,user){
        if(err){
            console.log('error in finding user from jwt');
            return;
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,user);
        }
    });
}));

module.exports = passport;