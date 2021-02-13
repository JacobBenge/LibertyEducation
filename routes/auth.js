const express = require ('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const catchAsync =  require('../utils/catchAsync');
const authController = require('../controllers/auth');

router.route('/login')
    // ROUTES TO LOGIN PAGE
    .get(authController.renderLogin)
    // PASSPORT-LOCAL AUTHENTICATION. IF FAILURE, THEN FLASH MESSAGE AND REDIRECT TO LOGIN
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), authController.passportAuthLocal)

router.route('/register')
    // ROUTES TO REGISTER PAGE
    .get(authController.renderRegister)
    // TRIGGERED WHEN REGISTER FORM IS SUBMITTED
    .post(catchAsync(authController.createUser))
    
// RENDER LOGOUT.
router.get('/logout', authController.renderLogout)

module.exports = router;