const User= require('../models/user');

module.exports.profile=function(req,res){
   // return res.end('<h1>User Profile</h1>');
   return res.render('user_profile',{
      title:"User Profile"
  });
}
//render signUp page
module.exports.signUp = function(req,res){
   return res.render('user_sign_up',{
      title: "Codeial || SignUp"
   });
}
//render signIn page
module.exports.signIn = function(req,res){
   return res.render('user_sign_in',{
      title: "Codeial || SignIn"
   });
}
//get sign Up data
module.exports.create = function(req,res){
   console.log(req.body);

   if(req.body.password != req.body.confirm_password){
      console.log(req.body.password);
      console.log(req.body.confirm_password);
      return res.redirect('back');
   }
   User.findOne({ email : req.body.email},function(err,user){
      if(err){ console.log('error in finding user in signing up'); return }

      if(!user){
         User.create(req.body, function(err,user){
            if(err){ console.log('error in creating user while siging up'); return }

            return res.redirect('/users/sign-in');
         })
      }else{
         return res.redirect('back');
      }
   });
}
//sign in and create a session for a user
module.exports.createSession = function(req,res){
   console.log('in create-session controller')
   return res.redirect('/');
}