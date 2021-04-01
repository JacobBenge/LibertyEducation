const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MUST MATCH schema.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN. 
const homeworkSchema = new Schema({
    subjectLine: {
        type: String,
        trim: true,
        required: true
    },
    url: {
        type: String,
        trim: true,
        required: false
    },
    urlLabel: {
        type: String,
        trim: true,
        required: false
    },
    stuId: { // NEEDS VALIDATION TO USE ENUM TO MAKE SURE THE student._id IS IN THE DATABASE
        type: String,
        trim: true,
        required: true
    },
    assignedStudent: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        maxLength: 70,
        required: true
    },
    dueDate: {
        type: Date,
        default: Date.now,
        trim: true,
        required: true
    },
    pointsPossible: {
        type: Number,
        trim: true,
        min: [0, 'Cannot have negative points'],
        max: 999,
        required: false
    },
    description: {
        type: String,
        trim: true,
        required: true
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
})

// EXPORTS THE STUDENT MODEL
module.exports = mongoose.model('Homework', homeworkSchema);