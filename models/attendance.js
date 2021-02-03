const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
const attendanceSchema = new Schema({
    date: String,
    enum: ['present', 'tardy', 'absent', 'excused absence']
});

// EXPORTS THE ATTENDANCE MODEL
module.exports = mongoose.model('Attendance', attendanceSchema);