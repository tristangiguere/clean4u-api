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

module.exports = invoicesDb;