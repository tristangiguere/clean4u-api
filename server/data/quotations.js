const mysql = require('mysql');

// Import environment
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
})

let quotationDb ={};

// Fetch all quotations from DB (not expired)
quotationDb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotations WHERE status != 9', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch all quotations from DB by status (not expired)
quotationDb.bystatus = (status) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotations WHERE status = ? AND status != 9', [status], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch all expired quotations from DB
quotationDb.expired = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotations WHERE status = 8', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch all cancelled quotations from DB
quotationDb.cancelled = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotations WHERE status = 9', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch single quotation from DB by id.
quotationDb.one = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotations WHERE id = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Fetch single quotation from DB by UUID (PUBLIC).
quotationDb.public = (uuid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotations WHERE public_key = ?', [uuid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Add new quotation to DB
quotationDb.new = (quote) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO quotations (name, email, phone, company, address, city, province, country, postal_code, type, make, model, year, notes, expiration_date, created_date, status, product_1, description_1, price_1, tax_amount_1, qty_1, rowtotal_1, product_2, description_2, price_2, tax_amount_2, qty_2, rowtotal_2, product_3, description_3, price_3, tax_amount_3, qty_3, rowtotal_3, subtotal, taxTotal, total, public_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [quote.name, quote.email, quote.phone, quote.company, quote.address, quote.city, quote.province, quote.country, quote.postal_code, quote.type, quote.make, quote.model, quote.year, quote.notes, quote.expiration_date, quote.created_date, quote.status, quote.product_1, quote.description_1, quote.price_1, quote.tax_amount_1, quote.qty_1, quote.rowtotal_1, quote.product_2, quote.description_2, quote.price_2, quote.tax_amount_2, quote.qty_2, quote.rowtotal_2, quote.product_3, quote.description_3, quote.price_3, quote.tax_amount_3, quote.qty_3, quote.rowtotal_3, quote.subtotal, quote.taxTotal, quote.total, quote.public_key], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Cancel quotation
quotationDb.cancel = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE quotations SET status = 9 WHERE id = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

module.exports = quotationDb;