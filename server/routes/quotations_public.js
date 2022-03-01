const express = require('express');
const router = express.Router();
const quotationsDb = require('../data/quotations');
const pdfService = require('../service/pdf-service');
const { v4: uuidv4 } = require('uuid');

// Get single quote by UUID (Public)
router.get('/:uuid', async (req, res, next) => {
    try{
        let results = await quotationsDb.public(req.params.uuid);
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;


