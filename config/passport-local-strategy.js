const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField :'email'
},function(email, password,done){ // args passing
//find a user and establish the identity
User.findOne({email :email},function(err,user){
    if(err){
        console.log("Error in finding user ------>passport");
        return done(err);
    }
    
    if(!user || user.password!=password){
        console.log('Invalid username/password');
        return done(null,false);
    }
    return done(null,user);//passing user
});
}
));

//serialiing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserealizin the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user ----->passport');

            return done(err);
        }
        return done(null,user);
    });
});

module.exports=passport;