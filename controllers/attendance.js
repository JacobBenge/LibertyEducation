const Student = require('../models/student');
const Attendance = require('../models/attendance');

// POST
module.exports.createAttendance = async (req, res) => {
    const student = await Student.findById(req.params.id);
    const attendance = new Attendance(req.body.attendance); // USE THE ATTENDANCE MODEL TO CREATE AN ATTENDANCE OBJECT
    attendance.author = req.user._id; // SAVES THE NAME OF THE AUTHOR AS THE CURRENTLY LOGGED IN USER
    student.attendance.push(attendance); // ADD THE ATTENDANCE OBJECT ID TO THE ATTENDANCE ARRAY UNDER THE STUDENT OBJECT
    await attendance.save(); // SAVE THE ATTENDANCE ITSELF
    await student.save(); // SAVE THE STUDENT
    req.flash('success', `Successfully added attendance for ${student.firstName}`);
    res.redirect(`/students/${student._id}`);
}
// DELETE
module.exports.deleteAttendance = async (req, res) => {
    const { id, attendanceId} = req.params;
    const student = await Student.findById(req.params.id); // FIND THE STUDENT IN THE DATABASE
    await Student.findByIdAndUpdate(id, {$pull: { attendance: attendanceId}  }); // REMOVES OBJECT ID FOR THE SPECIFIED ATTENDANCE FROM THE STUDENT OBJECT
    await Attendance.findByIdAndDelete(attendanceId); // DELETES THE ATTENDANCE OBJECT
    req.flash('success', `Successfully deleted attendance for ${student.firstName}`);
    res.redirect(`/students/${id}`);
}