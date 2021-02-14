const ExpressError = require('../utils/ExpressError');
const { studentSchema, attendanceSchema, homeworkSchema } = require('../schemas.js');
const Student = require('../models/student');
const Attendance = require('../models/attendance');
const Homework = require('../models/homework');

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
module.exports.validateAttendance = (req, res, next) => {
    const { error } = attendanceSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// CHECKS TO SEE IF PERSON LOGGED IN IS THE SAME AS THE PERSON WHO CREATED THE ITEM.
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const student = await Student.findById(id); // PULL THE STUDENT INFORMATION FROM DATABASE USING THE ID GIVEN
    if(!student.author.equals(req.user._id)  || req.user.isAdmin) { // IF THE PERSON THAT IS LOGGED IN IS NOT THE ORIGINAL AUTHOR
        req.flash('error', 'You do not have permission to do that action')
        return res.redirect(`/students/${id}`);
    }
    next();
}

// // CHECKS TO SEE IF PERSON LOGGED IN IS THE SAME AS THE PERSON WHO CREATED THE ITEM.
// module.exports.isAttendanceAuthor = async(req, res, next) => {
//     const { id, attendanceId } = req.params;
//     const attendance = await Attendance.findById(attendanceId); // PULL THE STUDENT INFORMATION FROM DATABASE USING THE ID GIVEN
//     if(!attendance.author.equals(req.user._id) || req.user.isAdmin) { // IF THE PERSON THAT IS LOGGED IN IS NOT THE ORIGINAL AUTHOR
//         req.flash('error', 'You do not have permission to do that action')
//         return res.redirect(`/students/${id}`);
//     }
//     next();
// }

// // CHECKS TO SEE IF PERSON LOGGED IN IS THE SAME AS THE PERSON WHO CREATED THE ITEM.
// module.exports.isHomeworkAuthor = async(req, res, next) => {
//     const { id } = req.params;
//     const homework = await Homework.findById(id); // PULL THE STUDENT INFORMATION FROM DATABASE USING THE ID GIVEN
//     if(!homework.author.equals(req.user._id) || req.user.isAdmin) { // IF THE PERSON THAT IS LOGGED IN IS NOT THE ORIGINAL AUTHOR
//         req.flash('error', 'You do not have permission to do that action')
//         return res.redirect(`/homework/${id}`);
//     }
//     next();
// }
