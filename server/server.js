const express = require('express');
// Import environment
require('dotenv').config();

const invoiceService = require('./routes/invoices');
const invoiceService_Public = require('./routes/invoices_public');
const quotesService = require('./routes/quotations');
const quotesServicePublic = require('./routes/quotations_public');
const quotationRequestService = require('./routes/requests');
const contactService = require('./routes/contact');
const authService = require('./routes/auth');

const app = express();

app.use(express.json());

// Public invoice view service (requires UUID)
app.use('/api/public/invoices', invoiceService_Public);
// Public quote view service (requires UUID)
app.use('/api/public/quotations', quotesServicePublic);

// Implement server-to-server auth
app.use((req, res, next) => {
    // Check for Bearer auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return res.status(401).json({ message: 'Missing API Key' });
    }
    else if ((req.headers.authorization.split(' ')[1]) !== process.env.API_KEY){
        return res.status(403).json({ message: 'Invalid API Key' });
    }
    // Allow through
    next()
})

// Global service routes
app.use('/api/invoices', invoiceService);
app.use('/api/quotations', quotesService);
app.use('/api/requests', quotationRequestService);
app.use('/api/auth', authService);

// Contact form service
app.use('/api/contact', contactService);



app.listen(process.env.PORT, () => {
    console.log('Clean4U API server is running on port: ' + process.env.PORT)
});