const mongoose = require('mongoose');
const Note = require('./note');
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
    coinsBalance: {
        type: Number,
        trim: true,
        min: [0, 'Cannot have negative points'],
        max: 99999,
        required: false
    },
    url1Label: {
        type: String,
        trim: true,
        required: false
    },
    url2Label: {
        type: String,
        trim: true,
        required: false
    },
    url3Label: {
        type: String,
        trim: true,
        required: false
    },
    url4Label: {
        type: String,
        trim: true,
        required: false
    },
    url1: {
        type: String,
        trim: true,
        required: false
    },
    url2: {
        type: String,
        trim: true,
        required: false
    },
    url3: {
        type: String,
        trim: true,
        required: false
    },
    url4: {
        type: String,
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
    emergPrimFirst: {
        type: String,
        trim: true,
        required: true
    },
    emergPrimLast: {
        type: String,
        trim: true,
        required: true
    },
    emergPrimRelationship: {
        type: String,
        trim: true,
        enum: relationshipTypes,
        required: true
    },
    emergPrimPhone: {
        type: String,
        trim: true,
        required: true
    },
    emergPrimEmail: {
        type: String,
        trim: true,
        required: true
    },
    emergSecFirst: {
        type: String,
        trim: true,
        required: false
    },
    emergSecLast: {
        type: String,
        trim: true,
        required: false
    },
    emergSecRelationship: {
        type: String,
        trim: true,
        enum: relationshipTypes,
        required: false
    },
    emergSecPhone: {
        type: String,
        trim: true,
        required: false
    },
    emergSecEmail: {
        type: String,
        trim: true,
        required: false
    },
    createdBy: {
        type: String,
        trim: true,
        required: false
    },
    createDate:{
        type: Date,
        default: Date.now,
        required: false
    },
    lastModifiedBy: {
        type: String,
        trim: true,
        required: false
    },
    lastModifiedDate:{
        type: Date,
        default: Date.now,
        required: false
    },
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
})

// CASCADE DELETES THE NOTES WHEN A STUDENT IS DELETED. THIS IS QUERY MIDDLEWARE, NOT DOCUMENT MIDDLEWARE
studentSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Note.deleteMany({
            _id: {
                $in: doc.note
            }
        })
    }
})

// EXPORTS THE STUDENT MODEL
module.exports = mongoose.model('Student', studentSchema);