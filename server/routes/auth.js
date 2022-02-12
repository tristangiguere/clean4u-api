const express = require('express');
const router = express.Router();
var sha512 = require('js-sha512');
const authDb = require('../data/auth');

// Get all requests
router.post('/login', async (req, res, next) => {
    try{
        let user = await authDb.one(req.body.username);
        if (sha512(req.body.password) == user.password){
            authObj = { token: '4d9c5fe1edfe060eb1355d08d5bcb60286ed8545ffd762c5c964e66079fc1d4e4b56d42c162c90b9fea73e67737626be5ea93f15cbad0ab6026d04ceb44a0bea' };
            res.json(authObj);
            res.statusCode(200);
        }
        else{
            throw new Error('Login failed.');
        }
    }
    catch(e){
        console.log(e);
        res.statusCode(500);
    }
});



module.exports = router;


