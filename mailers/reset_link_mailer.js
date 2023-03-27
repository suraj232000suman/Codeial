const nodeMailer = require('../config/nodemailer');

exports.resetLink = (token) =>{
    console.log('inside reset link mailer',token);
    
    // for sending template
    let htmlString = nodeMailer.renderTemplate({token: token},'/resetTokens/resetToken.ejs');
    
    nodeMailer.transporter.sendMail({
        from: '</Codeial>',
        to: token.user.email,
        subject: "Password Reset Token",
        //html: `<a>/reset-password/stage3/${token.accessToken}</a>`
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