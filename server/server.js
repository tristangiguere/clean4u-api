const express = require('express');

const invoiceService = require('./routes/invoices');
const quotationRequestService = require('./routes/requests');
const authService = require('./routes/auth');
const authMW = require('./middleware/auth');

const app = express();

app.use(express.json());

app.use('/api/invoices', authMW, invoiceService);
app.use('/api/requests',authMW, quotationRequestService);
app.use('/api/auth', authService);

const PORT = 3000;


app.listen(PORT, () => {
    console.log('Clean4U API server is running on port: ' + PORT)
});