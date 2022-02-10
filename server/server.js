const express = require('express');

const invoiceService = require('./routes/invoices')

const app = express();

app.use(express.json());

app.use('/api/invoices', invoiceService);

const PORT = 3000;


app.listen(PORT, () => {
    console.log('Clean4U API server is running on port: ' + PORT)
});