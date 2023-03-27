const express= require('express');
const router= express.Router();
const passport = require('passport');

const usersController= require('../controllers/users_controller');
const resetController= require('../controllers/reset_Password_controller');

//router.get('/profile',usersController.profile);
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);

router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);

router.get('/sign-out',usersController.destroySession);

router.get('/auth/google',passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/users/sign-in'}),usersController.createSession);

router.post('/create',usersController.create);
//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'},
),usersController.createSession);

router.get('/forget-password',resetController.forgetPassword);
router.post('/conferm-email',resetController.checkEmail);
router.get('/send-reset-link/:id',resetController.sendResetLink);
router.get('/reset-link/:id/:token',resetController.resetLinkCheck);
router.post('/update-password/:id',resetController.changePassword);
module.exports=router;