const ExpressError = require('../utils/ExpressError');
const { studentSchema, noteSchema, homeworkSchema, settingSchema } = require('../schemas.js');

// CHECKS TO SEE IF USER IS LOGGED IN
module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) { //isAuthenticated IS A PASSPORT FUNCTION
        req.session.returnTo = req.originalUrl; // SAVES THE ORIGINAL URL SO THAT WE CAN RETURN THE USER BACK TO THE PAGE THEY CAME FROM BEFORE HITTING THE LOGIN ROUTE.
        req.flash('error', 'You must first sign in before you can view that page');
        return res.redirect('/login'); // SINCE THE USER IS NOT LOGGED IN, SENT THEM TO THE LOGIN PAGE
    }
    next();
}

module.exports.isAdmin = async(req, res, next) => {
    if(!req.user.isAdmin){
        req.flash('error', 'Only admins can view that page')
        return res.redirect('/');
    }
    next();
}

// CHECKS TO SEE IF FORM INPUT MEETS SCHEMA CRITERIA, OTHERWISE THROWS ERROR.
module.exports.validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// CHECKS TO SEE IF FORM INPUT MEETS SCHEMA CRITERIA, OTHERWISE THROWS ERROR.
module.exports.validateHomework = (req, res, next) => {
    const { error } = homeworkSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// CHECKS TO SEE IF FORM INPUT MEETS SCHEMA CRITERIA, OTHERWISE THROWS ERROR.
module.exports.validateNote = (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// CHECKS TO SEE IF FORM INPUT MEETS SCHEMA CRITERIA, OTHERWISE THROWS ERROR.
module.exports.validateSetting = (req, res, next) => {
    const { error } = settingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}