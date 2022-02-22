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

let authDb ={}; 

// Fetch single user by username
authDb.one = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};

// Add new user to DB
authDb.new = (user) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, user.password], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};


module.exports = authDb;