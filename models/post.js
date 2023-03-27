const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the arr of ids of all comments in the post schema it self
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},{
    timestamps : true
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;