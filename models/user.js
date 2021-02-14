const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // https://www.npmjs.com/package/passport-local-mongoose  https://github.com/saintedlama/passport-local-mongoose#readme

const UserSchema = new Schema({
    userRegistrationCode:{
        type: String,
        required: true,
        trim: true,
        minLength: 24,
        maxLength: 24,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
});
UserSchema.plugin(passportLocalMongoose); // PASSPORT WILL ENSURE THAT USERNAMES ARE UNIQUE. AUTOMATICALLY HANDLES THE SCHEMA FOR USERNAME AND PASSWORD. ENABLES USE OF PASSPORT METHODS ON THE INDEX.JS FILE

module.exports = mongoose.model('User', UserSchema);