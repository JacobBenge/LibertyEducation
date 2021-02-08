const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAttendanceAuthor, validateAttendance } = require('../middleware/middleware');
const attendanceController = require('../controllers/attendance');

// SAVES THE ATTENDANCE IN THE ATTENDANCE COLLECTION AND ADDS THE ATTENDANCEID TO THE STUDENT OBJECT FOR REFERENCE
router.post('/', isAuthenticated, validateAttendance, catchAsync(attendanceController.createAttendance))

// TRIGGERED BY DELETE BUTTON ON ATTENDANCE. DELETES THE ATTENDANCE ITSELF AND THE ATTENDANCEID ON THE STUDENT OBJECT.
router.delete('/:attendanceId', isAuthenticated, isAttendanceAuthor, catchAsync(attendanceController.deleteAttendance))

module.exports = router;