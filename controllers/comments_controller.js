const Comment=require('../models/comment');
const  Post=require('../models/post');
const commentMailer = require('../mailers/comments_mailer.js');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');


module.exports.create=async function(req,res){
    try{
        let post=await Post.findById(req.body.post);
        if(post){
        //created comment in comment model
        let comment=await Comment.create({
        content:req.body.Content,
        post:req.body.post,
        user:req.user._id
        });

        post.comments.push(comment);
        post.save();

        // populating 'user' (with 'name' & 'email' keys) in 'comment' everytime a new comment is created
        comment = await comment.populate('user', 'name email');
        //commentMailer.newComment(comment);
        let job=queue.create('emails',comment).save(function(err){
            if(err){
                console.log('err in creating a queue');
                return;
            }
            console.log('job',job.id);
            return;
        })
        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment: comment
                },
                message: "comment created !!"
            });
        }
        // added in post model comment array
        res.redirect('/');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}
//delete comment
// module.exports.destroy=function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(comment.user==req.user.id){
//             let postId=comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId,{$pull: {comments:req.params.id}},
//                 function(err,post){
//                     if(err){
//                         console.log('error');
//                         res.redirect('back');
//                     }
//                     return res.redirect('back');
//         })
//             }else{
//                 return res.redirect('back');
//     }
// });
// }

module.exports.destroy=async function(req,res){
    try{
        //console.log(req.user);
        let comment=await Comment.findById(req.params.id);
        console.log(comment.user);
        if(comment.user==req.user.id){
            let postId=comment.post;
            comment.remove();
            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});

                 // send the comment id which was deleted back to the views
                 if (req.xhr) {
                   return res.status(200).json({
                     data: {
                       comment_id: req.params.id
                     },
                     message: 'Comment deleted'
                   });
                 }
            return res.redirect('back');
        }else{
              return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
};