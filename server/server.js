const express = require('express');

const invoiceService = require('./routes/invoices');
const invoiceService_Public = require('./routes/invoices_public');
const quotesService = require('./routes/quotations');
const quotesServicePublic = require('./routes/quotations_public');
const quotationRequestService = require('./routes/requests');
const contactService = require('./routes/contact');
const authService = require('./routes/auth');
const authMW = require('./middleware/auth');

const app = express();

app.use(express.json());

// Global service routes
app.use('/api/invoices', invoiceService);
app.use('/api/quotations', quotesService);
app.use('/api/requests', quotationRequestService);
app.use('/api/auth', authService);

// Public invoice view service (requires UUID)
app.use('/api/public/invoices', invoiceService_Public);

// Contact form service
app.use('/api/contact', contactService);

// Public quote view service (requires UUID)
app.use('/api/public/quotations', quotesServicePublic);

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Clean4U API server is running on port: ' + PORT)
});