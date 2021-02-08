const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAuthor, validateStudent } = require('../middleware/middleware');
const studentsController = require('../controllers/students');

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.success = req.flash(sucess);
    next();
})

router.route('/')
    // ROUTES USER TO INDEX PAGE FOR STUDENTS. LOADS ALL STUDENTS FROM DB AND LISTS THEM.
    .get(isAuthenticated, catchAsync(studentsController.index))
    // ADDS A NEW STUDENT TO DB
    .post(isAuthenticated, validateStudent, catchAsync(studentsController.createStudent))

// ROUTES USER TO NEW STUDENT PAGE
router.get('/new', isAuthenticated, studentsController.renderStudentNew)

router.route('/:id')
    // ROUTES USER TO STUDENT DETAILS (SHOW) PAGE
    .get(isAuthenticated, catchAsync(studentsController.renderStudentShow))
    // APPLIES UPDATES TO THE STUDENT INFO
    .put(isAuthenticated, isAuthor, validateStudent, catchAsync(studentsController.updateStudent))
    // TRIGGERED BY DELETE BUTTON ON STUDENT. DELETES THE STUDENT AND RELATED ATTENDANCE
    .delete(isAuthenticated, isAuthor, catchAsync(studentsController.deleteStudent))

// ROUTES USER TO STUDENT EDIT PAGE
router.get('/:id/edit', isAuthenticated, isAuthor, catchAsync(studentsController.renderStudentEdit))

module.exports = router;