const mongoose = require('mongoose');
const Attendance = require('./attendance');
const Schema = mongoose.Schema;

// MUST MATCH schema.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN. 
const studentSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    dateOfBirth: {
        type: String,
        trim: true,
        required: false
    },
    schoolYear: {
        type: Number,
        trim: true,
        required: false
    },
    primaryContactFirst: {
        type: String,
        trim: true,
        required: true
    },
    primaryContactLast: {
        type: String,
        trim: true,
        required: true
    },
    primaryContactRelationship: {
        type: String,
        trim: true,
        required: true
    },
    primaryContactPhone: {
        type: String,
        trim: true,
        required: true
    },
    primaryContactEmail: {
        type: String,
        trim: true,
        required: true
    },
    secondaryContactFirst: {
        type: String,
        trim: true,
        required: false
    },
    secondaryContactLast: {
        type: String,
        trim: true,
        required: false
    },
    secondaryContactRelationship: {
        type: String,
        trim: true,
        required: false
    },
    secondaryContactPhone: {
        type: String,
        trim: true,
        required: false
    },
    secondaryContactEmail: {
        type: String,
        trim: true,
        required: false
    },
    addressLine1: {
        type: String,
        trim: true,
        required: true
    },
    addressLine2: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    stateCode: {
        type: String,
        trim: true,
        min: 2,
        max: 2,
        required: true
    },
    zipCodeBase: {
        type: Number,
        trim: true,
        required: true
    },
    zipCodeExtension: {
        type: Number,
        trim: true,
        required: false
    },
    attendance: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attendance'
        }
    ]
})

// CASCADE DELETES THE REVIEWS WHEN A STUDENT IS DELETED. THIS IS QUERY MIDDLEWARE, NOT DOCUMENT MIDDLEWARE
studentSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Attendance.deleteMany({
            _id: {
                $in: doc.attendance
            }
        })
    }
})

// EXPORTS THE STUDENT MODEL
module.exports = mongoose.model('Student', studentSchema);