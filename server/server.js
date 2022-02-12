const express = require('express');

const invoiceService = require('./routes/invoices');
const quotesService = require('./routes/quotations');
const quotationRequestService = require('./routes/requests');
const authService = require('./routes/auth');
const authMW = require('./middleware/auth');

const app = express();

app.use(express.json());

// Global service routes
app.use('/api/invoices', invoiceService);
app.use('/api/quotations', quotesService);
app.use('/api/requests', quotationRequestService);
app.use('/api/auth', authService);

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Clean4U API server is running on port: ' + PORT)
});