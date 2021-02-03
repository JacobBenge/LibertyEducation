const mongoose = require('mongoose');
const Attendance = require('./attendance');
const Schema = mongoose.Schema;

// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN. 
const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: false
    },
    schoolYear: {
        type: Number,
        required: false
    },
    primaryContactFirst: {
        type: String,
        required: true
    },
    primaryContactLast: {
        type: String,
        required: true
    },
    primaryContactRelationship: {
        type: String,
        required: true
    },
    primaryContactPhone: {
        type: String,
        required: true
    },
    primaryContactEmail: {
        type: String,
        required: true
    },
    secondaryContactFirst: {
        type: String,
        required: false
    },
    secondaryContactLast: {
        type: String,
        required: false
    },
    secondaryContactRelationship: {
        type: String,
        required: false
    },
    secondaryContactPhone: {
        type: String,
        required: false
    },
    secondaryContactEmail: {
        type: String,
        required: false
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    stateCode: {
        type: String,
        min: 2,
        max: 2,
        required: true
    },
    zipCodeBase: {
        type: Number,
        required: true
    },
    zipCodeExtension: {
        type: Number,
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