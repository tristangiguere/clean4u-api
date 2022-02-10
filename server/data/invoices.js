const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'toorroot',
    user: 'root',
    database: 'mozart',
    host: '127.0.0.1',
    port: '3306'
})

let invoicesDb ={}; 

// Fetch all invoices from DB (not cancelled)
invoicesDb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM invoices_new WHERE status != 9', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch all invoices from DB by status (not cancelled)
invoicesDb.bystatus = (status) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM invoices_new WHERE status = ? AND status != 9', [status], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch all cancelled invoices from DB
invoicesDb.cancelled = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM invoices_new WHERE status = 9', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch single invoice from DB by id.
invoicesDb.one = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM invoices_new WHERE id = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Add new invoice to DB
invoicesDb.new = (invoice) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO invoices_new(name, email, phone, company, address, city, province, country, postal_code, terms, notes, due_date, created_date, status, product_1, description_1, price_1, tax_amount_1, qty_1, rowtotal_1, product_2, description_2, price_2, tax_amount_2, qty_2, rowtotal_2, product_3, description_3, price_3, tax_amount_3, qty_3, rowtotal_3, subtotal, taxTotal, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [invoice.name, invoice.email, invoice.phone, invoice.company, invoice.address, invoice.city, invoice.province, invoice.country, invoice.postal_code, invoice.terms, invoice.notes, invoice.due_date, invoice.created_date, invoice.status, invoice.product_1, invoice.description_1, invoice.price_1, invoice.tax_amount_1, invoice.qty_1, invoice.rowtotal_1, invoice.product_2, invoice.description_2, invoice.price_2, invoice.tax_amount_2, invoice.qty_2, invoice.rowtotal_2, invoice.product_3, invoice.description_3, invoice.price_3, invoice.tax_amount_3, invoice.qty_3, invoice.rowtotal_3, invoice.subtotal, invoice.taxTotal, invoice.total], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

module.exports = invoicesDb;