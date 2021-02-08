const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MUST MATCH schema.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
const attendanceSchema = new Schema({
    attendanceDate: {
        type: Date,
        min: '2021-01-01',
        max: '2031-12-31',
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
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// EXPORTS THE ATTENDANCE MODEL
module.exports = mongoose.model('Attendance', attendanceSchema);