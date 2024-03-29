const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField :'email',
    passReqToCallback: true
},function(req,email, password,done){ // args passing
//find a user and establish the identity
User.findOne({email :email},function(err,user){
    if(err){
        req.flash('error',err);
        // console.log("Error in finding user ------>passport");
        return done(err);
    }
    
    if(!user || user.password!=password){
        req.flash('success','Invalid UserId/Password !!');
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

passport.checkAuthentication = function(req,res,next){
    //if the user is signed in then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the users is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the curent signed in user from the session cookie and we are just sending this to the local for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports=passport;