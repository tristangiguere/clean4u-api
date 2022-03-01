const express = require('express');
const mailer = require('nodemailer');
const router = express.Router();
const quoteRequestsDb = require('../data/requests');

// Import environment
require('dotenv').config();

if (process.env.SMTP_SECURITY == 'true'){
  var security = true
}
else{
  var security = false;
}

// DEFINE TRANSPORT MAILER INFO
const transporter = mailer.createTransport({
    host: process.env.SMTP_HOSTNAME,
    port: process.env.SMTP_PORT,
    secure: security, // TODO - upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
});

// Get all requests
router.get('/', async (req, res, next) => {
    try{
        let results = await quoteRequestsDb.all();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get single request by ID
router.get('/:id', async (req, res, next) => {
    try{
        let results = await quoteRequestsDb.one(req.params.id);
        if (results){
            res.json(results);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(404);
        }
        
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Add new request
router.post('/', async (req, res, next) => {

    var date = new Date();
    var request = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        type: req.body.type,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        status: "New",
        created_at: date,
        services: req.body.services
    }
    try{

        let results = await quoteRequestsDb.new(request);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Delete request
router.delete('/:id', async (req, res, next) => {
    try{
        let request = await quoteRequestsDb.one(req.params.id);
        if (request){
            let results = await quoteRequestsDb.delete(req.params.id);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(404);
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Reply to request
router.post('/:id/reply', async (req, res, next) => {
    try{
        let quoteRequest = await quoteRequestsDb.one(req.params.id);

        if (req.body.message) {
            replyToRequest(quoteRequest, req.body.message);
            res.sendStatus(200);
        }
        else{
            console.log('Cannot send message with empty reply content.');
            res.sendStatus(500);
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Logic to send mail.
function replyToRequest(quoteRequest, message){
    var mailOptions = {
        from: 'info@clean4umtl.com',
        to: quoteRequest.email,
        subject: 'New message from Clean4U MTL',
        text: `Hello ${quoteRequest.first_name}, \nYou have a new message from the Clean4U Montreal team, in regards to your latest quotation request. \n\n\nMessage from Clean4U:\n${message} `
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




