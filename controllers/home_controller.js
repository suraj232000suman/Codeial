const Post = require('../models/post');
const { post } = require('../routes');
const User=require('../models/user');
// module.exports.home=function(req,res){
    // return res.end('<h1>Express is up for Codeial</h1>')
    // console.log(req.cookies);
    // res.cookie('user_id',55);


    // return res.render('home',{
    //     title:"Home"
    // });

    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    // Post.find({}).populate('user').exec(
    //     function(err,posts){
    //     return res.render('home',{
    //         title: "Codeial | home",
    //         posts: posts
    //     });
    // });
module.exports.home=async function(req,res){
    try{
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{ path:'user'}
         });
         //console.log(posts);
        let users=await User.find({});
        return res.render('home',{
            title: "Codeial | home",
            posts: posts,
            all_users:users
        });
    }catch(err){
        console.log('Error',err);
        return;
    }
}

