const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
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

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.flashMessage = req.flash(flashMessage);
    next();
})

// ROUTES USER TO INDEX PAGE FOR STUDENTS. LOADS ALL STUDENTS FROM DB AND LISTS THEM.
router.get('/', catchAsync(async (req, res) => {
    const students = await Student.find({});
    res.render('students/index', { students});
}))

// ROUTES USER TO NEW STUDENT PAGE
router.get('/new', (req, res) => {
    res.render('students/new');
})

// ADDS A NEW STUDENT TO DB
router.post('/', validateStudent, catchAsync(async (req, res) => {
    const student = new Student(req.body.student);
    await student.save();
    req.flash('flashMessage', `Successfully created a student profile for ${student.firstName}`); // FLASH IS USED TO PASS A ONE-TIME MESSAGE TO THE NEXT PAGE LOAD FOR A FLASH MESSAGE
    res.redirect(`/students/${student._id}`)
}))

// ROUTES USER TO STUDENT DETAILS PAGE
router.get('/:id', catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('attendance'); // LOADS ALL INFORMATION ABOUT THE STUDENT FROM MONGODB USING THE ID GIVEN IN THE URL. THEN POPULATES THE ATTENDANCE BY USING THE OBJECTIDS IN THE ATTENDANCE ARRAY
    if(!student) { // SAY YOU BOOKMARKED A STUDENT URL AND SOMEONE DELETES THAT STUDENT AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('errorFlashMessage', `Sorry, I couldn't find that student. Was that profile deleted?`); // FLASH A MESSAGE
        return res.redirect('/students'); // SEND TO /students RATHER THAN students/show. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('students/show', { student }); 
}))

// ROUTES USER TO STUDENT EDIT PAGE
router.get('/:id/edit', catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if(!student) { // SAY YOU BOOKMARKED A STUDENT URL AND SOMEONE DELETES THAT STUDENT AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('errorFlashMessage', `Sorry, I couldn't find that student. Was that profile deleted?`); // FLASH A MESSAGE
        return res.redirect('/students'); // SEND TO /students RATHER THAN students/edit. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('students/edit', { student });
}))

// APPLIES UPDATES TO THE STUDENT INFO
router.put('/:id', validateStudent, catchAsync(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, {...req.body.student}, { new: true })
    req.flash('flashMessage', `Successfully updated ${student.firstName}'s student profile`);
    res.redirect(`/students/${student.id}`)
}))

// TRIGGERED BY DELETE BUTTON ON STUDENT. DELETES THE STUDENT
router.delete('/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    const student = await Student.findById(req.params.id);
    // ALSO TRIGGERS CASCADE DELETE OF RELATED ATTENDANCE. SEE student.js line 20
    await Student.findByIdAndDelete(id);
    req.flash('flashMessage', `Successfully deleted ${student.firstName}'s student profile`);
    res.redirect('/students');
}))

module.exports = router;