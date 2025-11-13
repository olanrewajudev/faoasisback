"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    //   host: "server72.web-hosting.com",
    host: "gra108.truehost.cloud",
    port: 465,
    secure: true,
    auth: {
        user: 'support@finesseoasis.com.ng',
        pass: 'Divinelove12@'
    }
});

// async..await is not allowed in global scope, must use a wrapper
async function MailSender(mailTo, message, subject) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'support@finesseoasis.com.ng', // sender address
        to: mailTo, // list of receivers
        replyTo: 'support@finesseoasis.com.ng', // reply-to address
        subject: subject, // Subject line
        // text: message, // plain text body
        html: message, // html body
        
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Full response: ", info); // Log full response for debugging

}

// MailSender().catch(console.error);

module.exports = MailSender
