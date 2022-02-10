const express = require('express');

const router = express.Router();

const invoicesDb = require('../data/invoices');

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

// Get single invoice by ID
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
        total: req.body.total
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



module.exports = router;


