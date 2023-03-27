const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'surajsuman232000@gmail.com',
        pass: 'gnziiwevsbgtdfcn'
    }
});

let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers',relativePath),data,function(err,template){
            //console.log('T',template);
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML
}
module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
}