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

let quoteRequestsDb ={}; 

// Fetch all requests from DB
quoteRequestsDb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quote_requests', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

// Fetch single request from DB by id.
quoteRequestsDb.one = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quote_requests WHERE id = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Add new request to DB
quoteRequestsDb.new = (request) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO quote_requests (first_name, last_name, email, phone, type, make, model, year, status, created_at, services) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [request.first_name, request.last_name, request.email, request.phone, request.type, request.make, request.model, request.year, request.status, request.created_at, request.services], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Delete request
quoteRequestsDb.delete = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM quote_requests WHERE id = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results)
        })
    })
};

module.exports = quoteRequestsDb;