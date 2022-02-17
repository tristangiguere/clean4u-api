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

// Stream invoice PDF (Public)
router.get('/:uuid/pdf',async (req, res, next) => {
    try{
        let invoice = await invoicesDb.public(req.params.uuid);

        if (invoice){
        var fileName = 'Clean4U Invoice #' + invoice.id;

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

module.exports = router;


