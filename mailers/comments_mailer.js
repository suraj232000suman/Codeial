const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) =>{
    console.log('inside newComment mailer',comment);
    
    // for sending template
    let htmlString = nodeMailer.renderTemplate({comment: comment},'/comments/new_comments.ejs');
    
    nodeMailer.transporter.sendMail({
        from: '</Codeial>',
        to: comment.user.email,
        subject: "New Comment Published!",
        //html: '<h1>Yup, your comment is now published!</h1>'
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('message sent',info);
        return;
    });
}