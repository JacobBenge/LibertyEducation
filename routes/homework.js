const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAdmin, validateHomework } = require('../middleware/middleware');
const homeworkController = require('../controllers/homework');

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.success = req.flash(sucess);
    next();
})

router.route('/')
    // ROUTES USER TO INDEX PAGE FOR Homework. LOADS ALL Homework FROM DB AND LISTS THEM.
    .get(isAuthenticated, isAdmin, catchAsync(homeworkController.index))
    // ADDS A NEW Homework TO DB
    .post(isAuthenticated, isAdmin, validateHomework, catchAsync(homeworkController.createHomework))

// ROUTES USER TO NEW Homework PAGE
router.get('/new', isAuthenticated, isAdmin, catchAsync(homeworkController.renderHomeworkNew))

router.route('/:id')
    // ROUTES USER TO Homework DETAILS (SHOW) PAGE
    .get(isAuthenticated, isAdmin, catchAsync(homeworkController.renderHomeworkShow))
    // APPLIES UPDATES TO THE Homework INFO
    .put(isAuthenticated, isAdmin, validateHomework, catchAsync(homeworkController.updateHomework))
    // TRIGGERED BY DELETE BUTTON ON Homework. DELETES THE Homework AND RELATED NOTES
    .delete(isAuthenticated, isAdmin, catchAsync(homeworkController.deleteHomework))

// ROUTES USER TO Homework EDIT PAGE
router.get('/:id/edit', isAuthenticated, isAdmin, catchAsync(homeworkController.renderHomeworkEdit))

module.exports = router;