const express = require('express');
const router = express.Router();
const User = require('../models/user.js');      //User model File
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const userController = require('../controllers/users.js');
const {saveRedirectUrl} = require('../middleware.js');

//SignUp 
router.route('/')
.get(userController.renderSignupPage)
.post(wrapAsync(userController.userRegistration));

// Login
router.route('/login')
.get(userController.renderLoginPage)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/signup/login", failureFlash: true }) ,userController.redirectAfterLogin);

//Logout
router.get('/logout',userController.logOut);

module.exports = router;    

