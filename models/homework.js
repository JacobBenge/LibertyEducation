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
        required: true
    }
})

// EXPORTS THE STUDENT MODEL
module.exports = mongoose.model('Homework', homeworkSchema);