const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const Attendance = require('../models/attendance');
const ExpressError = require('../utils/ExpressError');
const { attendanceSchema } = require('../schemas.js');

// CHECKS TO SEE IF FORM INPUT MEETS SCHEMA CRITERIA, OTHERWISE THROWS ERROR.
const validateAttendance = (req, res, next) => {
    const { error } = attendanceSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// SAVES THE ATTENDANCE IN THE ATTENDANCE COLLECTION AND ADDS THE ATTENDANCEID TO THE STUDENT OBJECT FOR REFERENCE
router.post('/', validateAttendance, catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id);
    const attendance = new Attendance(req.body.attendance);
    student.attendance.push(attendance);
    await attendance.save();
    await student.save();
    res.redirect(`/students/${student._id}`);
}))

// TRIGGERED BY DELETE BUTTON ON ATTENDANCE. DELETES THE ATTENDANCE ITSELF AND THE ATTENDANCEID ON THE STUDENT OBJECT.
router.delete('/:attendanceId', catchAsync(async (req, res) => {
    const { id, attendanceId} = req.params;
    await Student.findByIdAndUpdate(id, {$pull: { attendance: attendanceId}  });
    await Attendance.findByIdAndDelete(attendanceId);
    res.redirect(`/students/${id}`);
}))

module.exports = router;