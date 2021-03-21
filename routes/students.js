const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAdmin, validateStudent } = require('../middleware/middleware');
const studentsController = require('../controllers/students');

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.success = req.flash(sucess);
    next();
})

router.route('/')
    // ROUTES USER TO INDEX PAGE FOR STUDENTS. LOADS ALL STUDENTS FROM DB AND LISTS THEM.
    .get(isAuthenticated, isAdmin, catchAsync(studentsController.index))
    // ADDS A NEW STUDENT TO DB
    .post(isAuthenticated, isAdmin, validateStudent, catchAsync(studentsController.createStudent))

// ROUTES USER TO NEW STUDENT PAGE
router.get('/new', isAuthenticated, isAdmin, studentsController.renderStudentNew)

router.route('/:id')
    // ROUTES USER TO STUDENT DETAILS (SHOW) PAGE
    .get(isAuthenticated, isAdmin, catchAsync(studentsController.renderStudentShow))
    // APPLIES UPDATES TO THE STUDENT INFO
    .put(isAuthenticated, isAdmin, validateStudent, catchAsync(studentsController.updateStudent))
    // TRIGGERED BY DELETE BUTTON ON STUDENT. DELETES THE STUDENT AND RELATED NOTES
    .delete(isAuthenticated, isAdmin, catchAsync(studentsController.deleteStudent))

// ROUTES USER TO STUDENT EDIT PAGE
router.get('/:id/edit', isAuthenticated, isAdmin, catchAsync(studentsController.renderStudentEdit))

module.exports = router;