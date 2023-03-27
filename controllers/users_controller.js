const User= require('../models/user');
const fs = require('fs'); // for file detection for avatar
const path=require('path'); // for file path
module.exports.profile=function(req,res){
   //console.log('profile',req);
      User.findById(req.params.id,function(err,user){
         return res.render('user_profile',{
         title: 'User Profile',
         profile_user: user
      });
  });
}
module.exports.update=async function(req,res){
      if(req.user.id==req.params.id){
         try{
            let user=await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req,res,function(err){
               if(err){
                  console.log('*****multer error:',err);
               }
               // we used multer noy we are able to use body
               console.log('in profile update controller',req.body.name);
               user.name=req.body.name;
               user.email=req.body.email;
               if(req.file){
                  if(user.avatar){
                     //help to delete
                     fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                  }
                  //this is saving the path of the uploaded file in avatar field in the user
                  user.avatar = User.avatarPath+'/'+req.file.filename;
               }
               user.save();
               //console.log(req.file);
               return res.redirect('back');
            });
         }catch(err){
            req.flash('error',err);
            return res.redirect('back');
         }
      }else{
         req.flash('error','unauthorized');
         return res.status(401).send('Unauthorized');
      }
};
//render signUp page
// module.exports.signUp = function(req,res){
//    return res.render('user_sign_up',{
//       title: "Codeial || SignUp"
//    });
// }

module.exports.signUp = function(req,res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile');
   }
   return res.render('user_sign_up',{
      title: "Codeial | Sign Up "
   })
}
//render signIn page
// module.exports.signIn = function(req,res){
//    return res.render('user_sign_in',{
//       title: "Codeial || SignIn"
//    });
// }

module.exports.signIn = function(req,res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile');
   }
   return res.render('user_sign_in',{
      title: "Codeial | Sign In"
   })
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
   // console.log('in create-session controller');
   req.flash('success','Logged in Successfull !!');
   return res.redirect('/');
}
// module.exports.destroySession = function(req, res)
// {
//    //  console.log(`${res.locals.user.name} signed out!`)
//     req.logout();
//    //  req.flash('success', 'Logged Out Successfully');
//     return res.redirect('/users/sign-in');
// }

// module.exports.destroySession = function(req,res){
//    req.logout(function(err){
//       if(err){
//          console.log('error');
//          req.flash('error',err);
//          return res.redirect('/');
//       }
//    });
//    console.log('success');
//    req.flash('success','Logout succesfull !!');
//    return res.redirect('/');
// };

module.exports.destroySession =async function(req,res){
   try{
      await req.logout(function(err){
         if(err){
            console.log('error');
            req.flash('error',err);
            return res.redirect('/');
         }
         req.flash('success','Logout succesfull !!');
         return res.redirect('/');
      });
   }catch(err){
      console.log('Error',err);
      return;
   }
};
