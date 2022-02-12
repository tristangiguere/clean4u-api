const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'toorroot',
    user: 'root',
    database: 'mozart',
    host: '127.0.0.1',
    port: '3306'
})

let authDb ={}; 

// Fetch single user by user id and password
authDb.one = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM auth WHERE username = ?', [username], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0])
        })
    })
};




module.exports = authDb;