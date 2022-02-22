const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
const authDb = require('../data/auth');

const saltRounds = 10;

// Create admin account
router.post("/register", async (req, res) => {
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const insertResult = await authDb.new({
      username: req.body.username,
      password: hashedPwd,
    });
    res.send(insertResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error Occured");
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const user = await authDb.one(req.body.username);
    
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        res.status(200).send("Login Successful");
      } else {
        res.status(401).send("Wrong username or password.");
      }
    } else {
      res.status(401).send("Wrong username or password.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error Occured");
  }
});

// Change password
router.put("/changepassword", async (req, res) => {
  try {
    const user = await authDb.one(req.body.username);
    
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        if (req.body.newpassword !== "" && req.body.password !== ""){
          const hashedPwd = await bcrypt.hash(req.body.newpassword, saltRounds);
          const result = await authDb.changepassword(req.body.username, hashedPwd);
          res.status(200).send("Password updated successfully.");
        }
      } else {
        res.status(401).send("Wrong username or password.");
      }
    } else {
      res.status(401).send("Wrong username or password.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error Occured");
  }
});





module.exports = router;


