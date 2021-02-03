const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Student = require('../models/student');
const { studentSchema } = require('../schemas.js');

// CHECKS TO SEE IF FORM INPUT MEETS SCHEMA CRITERIA, OTHERWISE THROWS ERROR.
const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// ROUTES USER TO INDEX PAGE FOR STUDENTS. LOADS ALL STUDENTSS FROM DB AND LISTS THEM.
router.get('/', catchAsync(async (req, res) => {
    const students = await Student.find({});
    res.render('students/index', { students });
}))

// ROUTES USER TO NEW STUDENT PAGE
router.get('/new', (req, res) => {
    res.render('students/new');
})

// ADDS A NEW STUDENT TO DB
router.post('/', validateStudent, catchAsync(async (req, res) => {
    const student = new Student(req.body.student);
    await student.save();
    res.redirect(`/students/${student._id}`)
}))

// ROUTES USER TO STUDENT DETAILS PAGE
router.get('/:id', catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('attendance');
    res.render('students/show', { student });
}))

// ROUTES USER TO STUDENT EDIT PAGE
router.get('/:id/edit', catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student });
}))

// APPLIES UPDATES TO THE STUDENT INFO
router.put('/:id', validateStudent, catchAsync(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, {...req.body.student}, { new: true })
    res.redirect(`/students/${student.id}`)
}))

// TRIGGERED BY DELETE BUTTON ON STUDENT. DELETES THE STUDENT
router.delete('/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    // ALSO TRIGGERS CASCADE DELETE OF RELATED ATTENDANCE. SEE student.js line 20
    await Student.findByIdAndDelete(id);
    res.redirect('/students');
}))

module.exports = router;