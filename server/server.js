const express = require('express');

const invoiceService = require('./routes/invoices');
const quotationRequestService = require('./routes/requests');

const app = express();

app.use(express.json());

app.use('/api/invoices', invoiceService);
app.use('/api/requests', quotationRequestService);

const PORT = 3000;


app.listen(PORT, () => {
    console.log('Clean4U API server is running on port: ' + PORT)
});