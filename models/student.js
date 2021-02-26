const mongoose = require('mongoose');
const Attendance = require('./attendance');
const Schema = mongoose.Schema;
const stateList = require('../public/scripts/stateList.js')
const relationshipTypes = require('../public/scripts/relationshipTypes.js')

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
    prefName: {
        type: String,
        trim: true,
        required: false
    },
    dateOfBirth: {
        type: Date,
        default: Date.now,
        trim: true,
        required: true
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
        enum: relationshipTypes,
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
        enum: relationshipTypes,
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
        required: false
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
        enum: stateList,
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
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Unknown'],
        required: true
    },
    notes: {
        type: String,
        trim: true,
        required: false
    },
    mathURL: {
        type: String,
        trim: true,
        required: false
    },
    languageArtsURL: {
        type: String,
        trim: true,
        required: false
    },
    spanishURL: {
        type: String,
        trim: true,
        required: false
    },
    codingURL: {
        type: String,
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