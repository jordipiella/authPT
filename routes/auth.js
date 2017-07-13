var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

const User = require('../models/user');

const bcryptSalt = 10;

router.get('/signup', function (req, res, next) {
  console.log('req', req.session);
  res.render('signup',);
});

router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);
  
  var newUser = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  });
})

router.get('/login', (req, res, next) => {
  if (req.session) {
    req.session.carrito = 'dada'
  }
  res.render('login')
})

router.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    return res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

  User.findOne({ "username": username }, (err, user) => {
    if (err || !user) {
      return res.render("login", {
        errorMessage: "The username doesn't exist"
      });
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/secret");
    } else {
      res.render("login", {
        errorMessage: "Incorrect password"
      });
    }
  });
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
})

module.exports = router;
