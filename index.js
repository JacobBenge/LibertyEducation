const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const mongooseOptions = {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
};

const students = require('./routes/students');
const attendance = require('./routes/attendance');

const database = "test-liberty"; //MUST BE LOWERCASE
const localHostPort = 3000; //ANY UNUSED PORT IS FINE FOR TESTING. DEFAULT IS 3000
const dbPort = 27017; //DEFAULT PORT FOR MONGODB

// MONGOOSE IS MIDDLEWARE THAT BRIDGES THE GAP BETWEEN EXPRESS AND MONGODB
// SETS UP MONGODB CONNECTION. mongod.exe MUST BE RUNNING ALREADY TO CONNECT.
mongoose.connect(`mongodb://localhost:${dbPort}/${database}`, mongooseOptions)
    .then(() => {
        console.log(`SUCCESSFULLY CONNECTED TO ${database} DATABASE ON MONGODB SERVER ON PORT: ${dbPort}`)
    })
    .catch(err => {
        console.log(`ERROR IN CONNECTING TO ${database} DATABASE ON MONGODB SERVER ON PORT: ${dbPort}`)
        console.log(err)
    })

// ENABLES EJS FOR PAGE TEMPLATING AND EMBEDDING JAVASCRIPT
app.set('view engine', 'ejs')
// ENABLES USE OF <% layout('boilerplate') -%> ON .ejs FILES. BETTER TEMPLATING THAN <% include ../footer %>
app.engine('ejs', ejsMate);
// SETS DEFAULT VIEWS PATH FOR EXPRESS
app.set('views', path.join(__dirname, 'views'))

// ENABLES USE OF POST AND PUT HTTP REQUESTS
app.use(express.urlencoded({ extended: true }))
// ENABLES FORMS TO TRIGGER DELETE HTTP REQUESTS WITH ADDING QUERY STRING TO URL ?_method=DELETE ON FORM SUBMISSION.
app.use(methodOverride('_method'));
// SERVES ALL FILES IN THE PUBLIC DIRECTORY WITH EVERY REQUEST
app.use(express.static(path.join(__dirname, 'public')));

// ANY URLS WITH /students WILL BE ROUTED TO ./routes/students.js
app.use('/students', students)
// IF :ID AND ATTENDANCE ADDED ON IT WILL ROUTE TO ./routes/attendance.js
app.use('/students/:id/attendance', attendance)

// DEFAULT INDEX PAGE. UNFINISHED. USED FOR FUTURE VISITORS WELCOME PAGE AND LOGIN. GO TO HTTP://localhost:3000/students/
app.get('/', (req, res) => {
    res.render('home')
})

// DEFAULT ERROR PAGE WILL TRIGGER IF NO OTHER ROUTES HIT
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// PASSES STATUS CODE AND ERROR MESSAGE TO DEFAULT ERROR PAGE (./partials/errorPage.ejs)
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong! Try again or contact your system admin' // IF NO ERROR MESSAGE IS GENERATED THEN USE DEFAULT ERROR MESSAGE
    res.status(statusCode).render('errorPage', { err })
})

// EXPRESS BEGINS LISTENING ON SPECIFIED PORT
app.listen(localHostPort, ()=> {
    console.log(`APP IS LISTENING ON http://localhost:${localHostPort}`)
})