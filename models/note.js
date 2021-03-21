const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MUST MATCH schema.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
const noteSchema = new Schema({
    noteDate: {
        type: Date,
        default: Date.now,
        trim: true,
        required: true
    },
    noteCategory: {
        type: String,
        trim: true,
        maxLength: 70,
        required: true
    },
    noteTitle: {
        type: String,
        trim: true,
        maxLength: 70,
        required: true
    },
    noteComment:{
        type: String,
        required: false
    }
});

// EXPORTS THE NOTE MODEL
module.exports = mongoose.model('Note', noteSchema);