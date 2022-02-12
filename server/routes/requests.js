const express = require('express');
const mailer = require('nodemailer');
const router = express.Router();
const quoteRequestsDb = require('../data/requests');

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
        res.json(results);
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
        let results = await quoteRequestsDb.delete(req.params.id);
        res.json(results);
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


