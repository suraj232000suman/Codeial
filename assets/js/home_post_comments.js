/*
class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;

    }
    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;
            console.log('js loaded');
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                     console.log(data);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button',newComment));
                },error:function(error){
                    console.log(error);
                }
            });
        });
    }

    newCommentDom(comment){
        return $(`
        <li>
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
            </small>
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>
        </p>
        </li>`);
    }
    
    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
}
*/
class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is create
    constructor(postId){
        //console.log('reached to class');
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        //console.log(this.newCommentForm);
        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            //console.log('preventDefault');
            let self = this;
                console.log( $(self).serialize());
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                
                success: function(data){
                    //console.log(data);
                    //console.log(data.comment);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                   // new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // CHANGE :: show the count of zero likes on this comment

        return $(`<li id="comment-${ comment._id }">
                        <p>
                            
                            <small>
                                <a class="delete-comment-button" href="/comment/destroy/${comment._id}">X</a>
                            </small>
                            
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                        </p>    
                </li>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}
