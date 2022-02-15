const express = require('express');

const router = express.Router();

const quotationDb = require('../data/quotations');

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
        res.json(results);
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
        total: req.body.total
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
        let results = await quotationDb.cancel(req.params.id);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


module.exports = router;


