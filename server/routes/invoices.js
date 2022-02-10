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



module.exports = router;