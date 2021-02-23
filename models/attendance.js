const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MUST MATCH schema.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
const attendanceSchema = new Schema({
    attendanceDate: {
        type: Date,
        default: Date.now,
        trim: true,
        required: true
    },
    attendanceCode: {
        type: String,
        enum: ['present', 'tardy', 'absent', 'excused absence'],
        required: true
    },
    comment:{
        type: String,
        required: false
    }
});

// EXPORTS THE ATTENDANCE MODEL
module.exports = mongoose.model('Attendance', attendanceSchema);