const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAdmin, validateSettings } = require('../middleware/middleware');
const settingsController = require('../controllers/settings');

// ADDS req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
router.get((req, res, next) => {
    res.locals.success = req.flash(sucess);
    next();
})

router.route('/')
    // ROUTES USER TO INDEX PAGE FOR STUDENTS. LOADS ALL STUDENTS FROM DB AND LISTS THEM.
    .get(isAuthenticated, isAdmin, catchAsync(settingsController.index))

router.route('/edit')
    // ROUTES USER TO SETTINGS EDIT PAGE
    .get(isAuthenticated, isAdmin, catchAsync(settingsController.renderSettingsEdit))
    // APPLIES UPDATES TO THE SETTINGS
    .put(isAuthenticated, isAdmin, validateSettings, catchAsync(settingsController.updateSettings))

module.exports = router;