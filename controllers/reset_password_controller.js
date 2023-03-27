const resetLinkMailer = require('../mailers/reset_link_mailer.js');
const resetToken = require('../models/resetPassword.js');
const User = require('../models/user.js');
const crypto = require('crypto');

module.exports ={
    forgetPassword: function(req,res){
        return res.render('conferm_email',{title: 'Conferm Email'});
    },
    checkEmail: function(req,res){
        User.findOne({email: req.body.email},function(err,user){
            if(err){
                console.log('DataBase Error',err);
                return res.redirect('back');
            }
            if(!user){
                console.log('Email not Registered !!');
                return res.redirect('back');
            }
            console.log(user.id);
            return res.redirect(`/users/send-reset-link/${user.id}`);
        });
    },
    sendResetLink: async function(req,res){
        console.log('inside sendResetLink',req.params.id);
        
        let user= await User.findById(req.params.id);
        
        if(!user){
            console.log('Invalid Url');
                return;
        }

        await resetToken.deleteMany({user: req.params.id}).then(function(){
            console.log('Deleted Data');
        }).catch(function(error){
            console.log('error');
        });

        let token=await resetToken.create({
           user: user.id,
           accessToken: crypto.randomBytes(20).toString('hex'),
           isValid: true
        });
        token =await token.populate('user','_id email name');
        
        console.log(token);

        resetLinkMailer.resetLink(token);
        return res.redirect('back');
    },
    resetLinkCheck: async function(req,res){
        let user= await User.findById(req.params.id);
        if(!user){
            req.flash('error','Invalid Request');
            return res.redirect('/');
        }
        let token = await resetToken.findOne({user: user.id, isValid: true});
        
        
        console.log('accessToken',token);
        if(!token){
            console.log('Some thing went wrong');
            return res.redirect('back');
        }
        if(token.accessToken != req.params.token){
            req.flash('error','Invalid Request');
            return res.redirect('/');
        }
        req.flash('success','Now Change Password');
        return res.render('update_password',{
            title: 'New Password',
            id: user._id
        });
    },
    changePassword: async function(req,res){
        let user = await User.findById(req.params.id);
        if(!user){
            req.flash('error','Invalid Request');
            return res.redirect('back');
        }

        if(req.body.new_password !== req.body.conferm_password){
            req.flash('error','Invalid Request');
            return res.redirect('back');
        }
        let token =await resetToken.findOne({
            user: req.params.id,
            isValid: true
        });

        if(!token){
            req.flash('error','Invalid Request');
            return res.redirect('back');
        }

        token.isValid=false;
        token.save();

        user.password=req.body.conferm_password;
        user.save();

        return res.redirect('/users/sign-in');
    }
}