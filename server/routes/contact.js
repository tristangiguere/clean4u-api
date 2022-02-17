const express = require('express');
const mailer = require('nodemailer');
const router = express.Router();

// DEFINE TRANSPORT MAILER INFO
const transporter = mailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false, // TODO - upgrade later with STARTTLS
    auth: {
      user: "6adeec485fd17d",
      pass: "77e50fbdd058b5",
    },
});

// Send message
router.post('/', async (req, res, next) => {

    var form = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }
    try{
        sendEmail(form);
        res.sendStatus(200);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Logic to send mail.
function sendEmail(form){
    
    var mailOptions = {
        from: form.email,
        to: "admin@clean4umtl.com",
        subject: `New message from customer`,
        html: 
        `<p><strong>From:</strong> ${form.name} (${form.email})</p>
        <p><strong>Message:</strong></p>
        <p>${form.message}</p>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = router;


