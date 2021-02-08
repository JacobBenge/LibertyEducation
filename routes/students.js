const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAuthor, validateStudent } = require('../middleware/middleware');
const Student = require('../models/student');

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.success = req.flash(sucess);
    next();
})

// ROUTES USER TO INDEX PAGE FOR STUDENTS. LOADS ALL STUDENTS FROM DB AND LISTS THEM.
router.get('/', isAuthenticated, catchAsync(async (req, res) => { // isAuthenticated IS A MIDDLEWARE FUNCTION THAT USES THE PASSPORT FUNCTION (isAuthenticated()) TO SEE IF USER IS LOGGED IN. IF NOT IT ROUTES TO LOGIN PAGE.
    const students = await Student.find({});
    res.render('students/index', { students});
}))

// ROUTES USER TO NEW STUDENT PAGE
router.get('/new', isAuthenticated, (req, res) => { 
    res.render('students/new');
})

// ADDS A NEW STUDENT TO DB
router.post('/', isAuthenticated, validateStudent, catchAsync(async (req, res) => {
    const student = new Student(req.body.student);
    student.author = req.user._id; // TAKES THE USERNAME OF THE CURRENTLY LOGGED IN ACCOUNT AND SAVES IT AS THE AUTHOR.
    await student.save();
    req.flash('success', `Successfully created a student profile for ${student.firstName}`); // FLASH IS USED TO PASS A ONE-TIME MESSAGE TO THE NEXT PAGE LOAD FOR A FLASH MESSAGE
    res.redirect(`/students/${student._id}`)
}))

// ROUTES USER TO STUDENT DETAILS PAGE
router.get('/:id', isAuthenticated, catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id).populate({
        path:'attendance', // POPULATE ALL THE ATTENDANCE
        populate: {
            path: 'author' // POPULATE ALL THE AUTHORS FOR EACH ATTENDANCE
        }
    }).populate('author'); // LOADS ALL INFORMATION ABOUT THE STUDENT FROM MONGODB USING THE ID GIVEN IN THE URL. THEN POPULATES THE ATTENDANCE BY USING THE OBJECTIDS IN THE ATTENDANCE ARRAY. SAME FOR THE AUTHOR.
    if(!student) { // SAY YOU BOOKMARKED A STUDENT URL AND SOMEONE DELETES THAT STUDENT AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that student. Was that profile deleted?`); // FLASH A MESSAGE
        return res.redirect('/students'); // SEND TO /students RATHER THAN students/show. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('students/show', { student }); 
}))

// ROUTES USER TO STUDENT EDIT PAGE
router.get('/:id/edit', isAuthenticated, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    if(!student) { // SAY YOU BOOKMARKED A STUDENT URL AND SOMEONE DELETES THAT STUDENT AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that student. Was that profile deleted?`); // FLASH A MESSAGE
        return res.redirect('/students'); // SEND TO /students RATHER THAN students/edit. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('students/edit', { student });
}))

// APPLIES UPDATES TO THE STUDENT INFO
router.put('/:id', isAuthenticated, isAuthor, validateStudent, catchAsync(async (req, res) => {
    const { id } = req.params; // PULLS THE STUDENT ID FROM THE REQUEST PARAMETERS (URL)
    const student = await Student.findByIdAndUpdate(id, {...req.body.student}, { new: true })
    req.flash('success', `Successfully updated ${student.firstName}'s student profile`);
    res.redirect(`/students/${student.id}`);
}))

// TRIGGERED BY DELETE BUTTON ON STUDENT. DELETES THE STUDENT
router.delete('/:id', isAuthenticated, isAuthor, catchAsync(async (req,res) => {
    const { id } = req.params; // PULLS THE STUDENT ID FROM THE REQUEST PARAMETERS (URL)
    const student = await Student.findById(req.params.id);
    await Student.findByIdAndDelete(id); // ALSO TRIGGERS CASCADE DELETE OF RELATED ATTENDANCE. SEE student.js line 20
    req.flash('success', `Successfully deleted ${student.firstName}'s student profile`);
    res.redirect('/students');
}))

module.exports = router;