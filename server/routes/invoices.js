const express = require('express');
const mailer = require('nodemailer');
const router = express.Router();
const invoicesDb = require('../data/invoices');
const pdfService = require('../service/pdf-service');
const { v4: uuidv4 } = require('uuid');

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

// Get all invoices
router.get('/', async (req, res, next) => {
    try{
        let results = await invoicesDb.all();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all unpaid invoices
router.get('/unpaid', async (req, res, next) => {
    try{
        let results = await invoicesDb.bystatus(0);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all partial invoices
router.get('/partial', async (req, res, next) => {
    try{
        let results = await invoicesDb.bystatus(1);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all paid invoices
router.get('/paid', async (req, res, next) => {
    try{
        let results = await invoicesDb.bystatus(3);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get all cancelled invoices
router.get('/cancelled', async (req, res, next) => {
    try{
        let results = await invoicesDb.cancelled();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Get single invoice by ID
router.get('/:id', async (req, res, next) => {
    try{
        let results = await invoicesDb.one(req.params.id);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Add new invoice
router.post('/', async (req, res, next) => {
    var date = new Date();

    var invoice = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        postal_code: req.body.postal_code,
        terms: req.body.terms,
        notes: req.body.notes,
        due_date: req.body.due_date,
        created_date: date,
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

        let results = await invoicesDb.new(invoice);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Cancel invoice
router.put('/:id/cancel', async (req, res, next) => {
    try{
        let results = await invoicesDb.cancel(req.params.id);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Stream invoice PDF
router.get('/:id/pdf',async (req, res, next) => {
    try{
        let invoice = await invoicesDb.one(req.params.id);

        if (invoice){
        var fileName = 'Clean4U Invoice #' + req.params.id;

        const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename=` + fileName,
        });

        // Pass data to PDF service and generate PDF.
        invoicePDF = pdfService.buildInvoicePDF((chunk) => stream.write(chunk), () => stream.end(), invoice);
        
        }
        else{
            res.sendStatus(500);
        }
    }

    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Send invoice via Email
router.post('/:id/send', async (req, res, next) => {
    try{
        let invoice = await invoicesDb.one(req.params.id);

        if (invoice) {
            sendInvoice(invoice);
            res.sendStatus(200);
        }
        else{
            console.log('Cannot send empty invoice object.');
            res.sendStatus(500);
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

// Logic to send mail.
function sendInvoice(invoice){

    var date = invoice.due_date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    var mailOptions = {
        from: 'billing@clean4umtl.com',
        to: invoice.email,
        subject: `Invoice #${invoice.id} from Clean4U MTL`,
        html: `<p>Hello ${invoice.name},<br/>You have a new invoice from Clean4U Montreal.<hr><br/><strong>Invoice #${invoice.id}</strong> is due by ${date}.<br/><a href="http://localhost:8000/customer/invoice/${invoice.public_key}">Click here to view your invoice.</a></p>`
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


