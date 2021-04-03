const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MUST MATCH schema.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN. 
const settingsSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    hours: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    addressURL: {
        type: String,
        trim: true,
        required: true
    },
    fbook: {
        type: String,
        trim: true,
        required: true
    },
    fbookURL: {
        type: String,
        trim: true,
        required: true
    },
    pay: {
        type: String,
        trim: true,
        required: true
    },
    payURL: {
        type: String,
        trim: true,
        required: true
    },
    qLink1: {
        type: String,
        trim: true,
        required: true
    },
    qLink1URL: {
        type: String,
        trim: true,
        required: true
    },
    qLink2: {
        type: String,
        trim: true,
        required: true
    },
    qLink2URL: {
        type: String,
        trim: true,
        required: true
    },
    qLink3: {
        type: String,
        trim: true,
        required: true
    },
    qLink3URL: {
        type: String,
        trim: true,
        required: true
    },
    // lastModifiedBy: {
    //     type: String,
    //     trim: true,
    //     required: false
    // },
    // lastModifiedDate:{
    //     type: Date,
    //     default: Date.now,
    //     required: false
    // }
})

// EXPORTS THE STUDENT MODEL
module.exports = mongoose.model('Settings', settingsSchema);