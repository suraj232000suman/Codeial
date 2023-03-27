const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index =async function(req,res){
    let posts =await Post.find({})
                .sort('_createdAt')
                .populate('user','name')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: '-password'
                    }
                });
                
            return res.status(200).json({
                message: "List of posts",
                posts: posts
            });
}

// module.exports.index = function(req,res){
//     return res.status(200).json({
//         message: "List of posts",
//         posts: []
//     });
// };

module.exports.destroy = async function(req,res){
    try{
        //console.log(req.params);
        let post = await Post.findById(req.params.id);
        console.log(post);

        post.remove();

        await Comment.deleteMany({ post: req.params.id });
        
        return res.status(200).json({
        message: "Post and associated comment deleted successfully"
        })
    }catch(err){
        console.log('****err');
        return res.status(500).json({
        message: "Internal server error"
        });
    }
}