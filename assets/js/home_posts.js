{

    console.log('script loaded');
    var x = document.querySelector('.btn');
    console.log('x',x);
    var y=document.querySelector('.aside-frame');
    console.log('y',y);
    x.addEventListener('click',() => {
        y.classList.toggle('open-comments-frame');
        x.style.backgroundColor='green';
        x.style.color='white';
    });

let createPost=function(){
    console.log('createPost fn is Active Now');
    let newPostForm=$('#new-post-form');
    newPostForm.submit(function(e){
        e.preventDefault();
        console.log('here in preventDefault');
        //create api call
        //dont frgot to accept req on post create controller 
        $.ajax({
            type: 'post',
            url: '/posts/create',
            data: newPostForm.serialize(),
            success: function(data){
              
                let newPost=createPostDom(data.data.post);
                $('#posts-lists-container>ul').prepend(newPost);
                console.log('np',newPost);
                console.log('new post created');
                
                // passing the element 
                deletePost(' .delete-post-btn', newPost);
                createComment(data.data.post._id);
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });
};

let createPostDom= function(post){
    console.log('post');
    console.log(post);
    return $(`
    <li id="post-${post._id}" class="post-design">
    <div class="post-header">
        <small class="post-user-name">
            ${post.user.name}
        </small>
            <small>
                <a href="/posts/destroy/${post._id}" class="delete-post-btn">X</a>
            </small>
    </div>
    <p>
        ${post.content}
    </p>
    <div class="post-comments">
        <form  action="/Comments/create" id="post-${post._id}-comments-form" method="POST">
            <input type="text" name="Content" placeholder="Add Comments..." required>
            <input type="hidden" name="post" value="${post._id}">
            <input type="submit" value="Add Comment">
        </form>

            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                    
                </ul>
            </div>
    </div>
    </li>
    `);
    /*
    return $(`
    <li id="post-${post._id}" class="post-design">
        <small>
            <a href="/posts/destroy/${post._id}" class="delete-post-btn">X</a>
        </small>
    <p>
        ${post.content}
        <br>
        <small>
            ${post.user.name}
        </small>
    </p>
    <div class="post-comments">
            <form  action="/Comments/create" id="post-${post._id}-comments-form" method="POST">
                <input type="text" name="Content" placeholder="Add Comments..." required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Comment">
            </form>

            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
    </div>
    </li>
    `);*/
}

let deletePost=function(deleteLink, postElement){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                console.log(data);
                postElement.remove();
                console.log('Post Deleted !!');
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });
}

let convertPostsToAjax = function(){
    console.log('PostsToAjax fn is Active');
    $('#posts-lists-container>ul>li').each(function(){
        let self = $(this);
        let deleteButton = $('.delete-post-btn', self);
        deletePost(deleteButton, self);

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
        createComment(postId);
    })
}

let createComment = function(postId){
    console.log('postId',postId);
    let postCommentForm = $(`#post-${postId}-comments-form`);
    postCommentForm.submit(function(e){
        e.preventDefault();
        console.log('getting cC event');
        $.ajax({
            type: 'post',
            url: '/Comments/create',
            data: postCommentForm.serialize(),
            success: function(data){
                console.log('data');
                console.log(data.data.comment);
                let newComment = createCommentDom(data.data.comment);
                console.log('design',newComment);
                 $(`#post-comments-${postId}`).prepend(newComment);
                 deleteComment($(' .delete-cmt-btn',newComment));
                 console.log('comment added !!');
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    });
}

let createCommentDom=function(comment){
    console.log('dom',comment);
    return $(`
    <li id="comment-${comment._id}">
    <p>
        <small>
            <a href="/comments/destroy/${comment._id}" class="delete-cmt-btn">X</a>
        </small>
        ${comment.content}
        <br>
        <small>
            ${comment.user.name}
        </small>
    </p>
    </li>
        `);
};

let deleteComment = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success:function(data){
                console.log('scs',data);
                $(`#comment-${data.data.comment_id}`).remove();
                console.log('comment deleted successfully');
            },
            error:function(err){
                console.log(err.responseText)
            }
        });
    });
}

let convertCommentsToAjax = function(){
    $('.post-comments-list>ul>li').each(function(){
        let self = $(this);
        let deleteBtn = $(' .delete-cmt-btn', self);
        deleteComment(deleteBtn);
    });    
}


createPost();
convertPostsToAjax();
convertCommentsToAjax();
}
