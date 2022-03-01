const express = require('express');
const router = express.Router();
const quotationDb = require('../data/quotations');
const { v4: uuidv4 } = require('uuid');
const mailer = require('nodemailer');

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

// Get all quotes
router.get('/', async (req, res, next) => {
    try{
        let results = await quotationDb.all();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all accepted quotes
router.get('/accepted', async (req, res, next) => {
    try{
        let results = await quotationDb.bystatus(3);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all expired quotes
router.get('/expired', async (req, res, next) => {
    try{
        let results = await quotationDb.expired();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all cancelled quotes
router.get('/cancelled', async (req, res, next) => {
    try{
        let results = await quotationDb.cancelled();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get single quote by ID
router.get('/:id', async (req, res, next) => {
    try{
        let results = await quotationDb.one(req.params.id);
        if (results){
            res.json(results);
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

// Add new quotation
router.post('/', async (req, res, next) => {

    var date = new Date();
    var quotation = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        postal_code: req.body.postal_code,
        type: req.body.type,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        expiration_date: req.body.expiration_date,
        created_date: date,
        notes: req.body.notes,
        status: 0,
        product_1: req.body.product_1,
        description_1: req.body.description_1,
        price_1: req.body.price_1,
        tax_amount_1: req.body.tax_amount_1,
        qty_1: req.body.qty_1,
        rowtotal_1: req.body.rowtotal_1,
        product_2: req.body.product_2,
        description_2: req.body.description_2,
        price_2: req.body.price_2,
        tax_amount_2: req.body.tax_amount_2,
        qty_2: req.body.qty_2,
        rowtotal_2: req.body.rowtotal_2,
        product_3: req.body.product_3,
        description_3: req.body.description_3,
        price_3: req.body.price_3,
        tax_amount_3: req.body.tax_amount_3,
        qty_3: req.body.qty_3,
        rowtotal_3: req.body.rowtotal_3,
        subtotal: req.body.subtotal,
        taxTotal: req.body.taxTotal,
        total: req.body.total,
        public_key: uuidv4()

    }
    try{

        let results = await quotationDb.new(quotation);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Cancel quotation
router.put('/:id/cancel', async (req, res, next) => {
    try{
        let quotation = await quotationDb.one(req.params.id);
        if (quotation){
            let results = await quotationDb.cancel(req.params.id);
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

// Send quotation via email
router.post('/:id/send', async (req, res, next) => {
    try{
        let quotation = await quotationDb.one(req.params.id);

        if (quotation) {
            sendQuotation(quotation);
            res.sendStatus(200);
        }
        else{
            console.log('Cannot send empty quotation object.');
            res.sendStatus(404);
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Logic to send mail.
function sendQuotation(quotation){

    var date = quotation.expiration_date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    var mailOptions = {
        from: 'info@clean4umtl.com',
        to: quotation.email,
        subject: `Your quotation #${quotation.id} from Clean4U MTL`,
        html: `<p>Hello ${quotation.name},<br/>You have a new quotation from Clean4U Montreal.<hr><br/><strong>Quote #${quotation.id}</strong> will exire on ${date}.<br/><a href="http://localhost:8000/customer/quote/${quotation.public_key}">Click here to view your quotation.</a></p>`
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