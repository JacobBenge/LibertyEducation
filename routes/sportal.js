const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const { isAuthenticated, isAdmin } = require('../middleware/middleware');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Homework = require('../models/homework');

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.success = req.flash(sucess);
    next();
})

// RENDER THE STUDENT PORTAL PAGE
router.get('/', isAuthenticated, catchAsync(async (req, res) => { 
    try{
        const userRegistrationCode = req.user.userRegistrationCode; // OBTAIN THE CODE FROM THE REQUEST
        const student = await Student.findById(userRegistrationCode) // LOOKUP THE MATCHING STUDENT
        res.render('sportal', { student }) // SEND THE STUDENT OBJECT BACK WITH THE RESPONSE SO ejs CAN ACCESS IT
    } catch(e) {
        req.flash('error', `Your registration code is no longer connected to a student profile. Admin's should create a dummy account to view the student portal`) // YOU GET THIS ERROR IF THE TEACHER DELETES A STUDENT FROM THE DATABASE AND THE USER TRIES TO VISIT THE STUDENT PORTAL.
        return res.redirect('/');
    }
}))

// RENDER THE STUDENT PROFILE PAGE
router.get('/profile', isAuthenticated, catchAsync(async (req, res) => { 
    try{
        const userRegistrationCode = req.user.userRegistrationCode; // OBTAIN THE CODE FROM THE REQUEST
        const student = await Student.findById(userRegistrationCode) // LOOKUP THE MATCHING STUDENT
        res.render('sportal/profile', { student }) // SEND THE STUDENT OBJECT BACK WITH THE RESPONSE SO ejs CAN ACCESS IT
    } catch(e) {
        req.flash('error', `Your registration code is no longer connected to a student profile.`) // YOU GET THIS ERROR IF THE TEACHER DELETES A STUDENT FROM THE DATABASE AND THE USER TRIES TO VISIT THE STUDENT PORTAL.
        return res.redirect('/');
    }
}))

// RENDER THE HOMEWORK PAGE
router.get('/homework', isAuthenticated, catchAsync(async (req, res) => { 
    try{
        const userRegistrationCode = req.user.userRegistrationCode; // OBTAIN THE CODE FROM THE REQUEST
        const student = await Student.findById(userRegistrationCode) // LOOKUP THE MATCHING STUDENT
        const homework = await Homework.find({ stuId: `${userRegistrationCode}`}).exec(); // LOOKUP THE MATCHING HOMEWORK https://mongoosejs.com/docs/api.html#model_Model.find
        res.render('sportal/homework', { student, homework }) // SEND THESE OBJECTs BACK WITH THE RESPONSE SO ejs CAN ACCESS IT
    } catch(e) {
        req.flash('error', `Your registration code is no longer connected to a student profile.`) // YOU GET THIS ERROR IF THE TEACHER DELETES A STUDENT FROM THE DATABASE AND THE USER TRIES TO VISIT THE STUDENT PORTAL.
        return res.redirect('/');
    }
}))

// RENDER THE PROGRESS REPORT (Notes)
router.get('/:id', isAuthenticated, catchAsync(async (req, res) => { 
    try{
        const userRegistrationCode = req.user.userRegistrationCode; // OBTAIN THE CODE FROM THE REQUEST
        const student = await Student.findById(userRegistrationCode).populate({path:'note'}); // LOOKUP THE MATCHING STUDENT AND POPULATE THE NOTES
        res.render('sportal/progress', { student }) // SEND THE STUDENT OBJECT BACK WITH THE RESPONSE SO ejs CAN ACCESS IT
    } catch(e) {
        req.flash('error', `Your registration code is no longer connected to a student profile.`) // YOU GET THIS ERROR IF THE TEACHER DELETES A STUDENT FROM THE DATABASE AND THE USER TRIES TO VISIT THE STUDENT PORTAL.
        return res.redirect('/');
    }
}))

module.exports = router;