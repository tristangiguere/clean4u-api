const express = require('express');
const router = express.Router();
var sha512 = require('js-sha512');
const authDb = require('../data/auth');

module.exports = function serverAuth(req, res) {
    return function (req, res, next) {
      if (req.body.username == "01") {
        next()
      }
      
    }
  }

module.exports = router;


