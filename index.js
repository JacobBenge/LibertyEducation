// USE THE COMMAND (
// SET NODE_ENV=production
// node index.js 
// TO START UP APP IN PRODUCTION MODE
if(process.env.NODE_ENV !== "production") { //STORES SESSION SECRET IN AN ENVIRONMENT VARIABLE. 
    require('dotenv').config();
}

/** NPM PACKAGES IMPORT **/
const express = require('express'); // EXPRESS MANAGES ROUTING/CONTROLLERS. IT MAKES OUR WEBSITE A SINGLE PAGE
const app = express();
const session = require('express-session'); // EXPRESS SESSION AUTOMATICALLY GIVES THE USER A connect.sid COOKIE. YOU CAN SEE THIS COOKIE UNDER THE Application> Cookies TAB IN THE CHROME DEVELOPER'S CONSOLE.
const mongoSanitize = require('express-mongo-sanitize'); // HELPS PREVENT MONGO INJECTION (NoSQL Injection)
const helmet = require('helmet'); // https://helmetjs.github.io/
const flash = require('connect-flash'); // USED FOR FLASH ALERTS. NEEDS TO HAVE EXPRESS-SESSION INSTALLED TO WORK
const path = require('path'); // PROVIDES UTILITIES FOR WORKING WITH FILE AND DIRECTORY PATHS. SEE __dirname
const ejsMate = require('ejs-mate'); // ENABLES USE OF BOILERPLATE LAYOUTS AND PARTIALS
const methodOverride = require('method-override'); // ENABLES US TO TRIGGER PUT & DELETE HTTP REQUESTS/VERBS WITH FORMS
const passport = require('passport'); // http://www.passportjs.org/   https://github.com/jaredhanson/passport
const LocalStrategy = require('passport-local'); // http://www.passportjs.org/packages/passport-local/    https://github.com/jaredhanson/passport-local
const mongoose = require('mongoose'); // MONGOOSE IS MIDDLEWARE THAT MANAGES THE GAP BETWEEN EXPRESS AND MONGODB
const mongooseOptions = {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
};

/** OUR IMPORTS AND CONSTANTS **/
const User = require('./models/user');
const studentsRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth');
const ExpressError = require('./utils/ExpressError');
const database = "test-liberty"; //MUST BE LOWERCASE
const localHostPort = 3000; //ANY UNUSED PORT IS FINE FOR TESTING. DEFAULT IS 3000
const dbPort = 27017; //DEFAULT PORT FOR MONGODB

// SETS UP MONGODB CONNECTION. mongod.exe MUST BE RUNNING ALREADY TO CONNECT. 
mongoose.connect(`mongodb://localhost:${dbPort}/${database}`, mongooseOptions)
    .then(() => {
        console.log(`SUCCESSFULLY CONNECTED TO ${database} DATABASE ON MONGODB SERVER ON PORT: ${dbPort}`)
    })
    .catch(err => {
        console.log(`ERROR IN CONNECTING TO ${database} DATABASE ON MONGODB SERVER ON PORT: ${dbPort}`)
        console.log(err)
    })

// ENABLES USE OF <% layout('boilerplate') -%> ON .ejs FILES. BETTER TEMPLATING THAN <% include ../footer %>
app.engine('ejs', ejsMate);
// ENABLES EJS FOR PAGE TEMPLATING AND EMBEDDING JAVASCRIPT
app.set('view engine', 'ejs')
// SETS DEFAULT VIEWS PATH FOR EXPRESS
app.set('views', path.join(__dirname, 'views'))

// ENABLES USE OF POST AND PUT HTTP REQUESTS
app.use(express.urlencoded({ extended: true }))
// ENABLES FORMS TO TRIGGER DELETE HTTP REQUESTS WITH ADDING QUERY STRING TO URL ?_method=DELETE ON FORM SUBMISSION.
app.use(methodOverride('_method'));
// SERVES ALL FILES IN THE PUBLIC DIRECTORY WITH EVERY REQUEST
app.use(express.static(path.join(__dirname, 'public')));
// SANITIZES REQUESTS BY REPLACING $ AND PERIODS WITH AN UNDERSCORE
app.use(mongoSanitize({
    replaceWith: '_'
}))

const sessionOptions = { 
    name: 'sessionID', // CHANGES DEFAULT NAME OF SESSIONID (connect.sid)
    secret: process.env.SECRET, // THE SECRET IS USED TO SIGN THE COOKIES TO CONFIRM THAT THEY HAVEN'T BEEN TAMPERED WITH. NEED TO MAKE THIS AN ENVIRONMENT VARIABLE.
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24, // Date.now() IS IN MILLISECONDS. EXPIRES IN A DAY
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true, // HELPS PREVENT CROSS-SITE SCRIPTING ATTACKS FROM ACCESSING THE SESSIONID (connect.sid)
        // secure: true // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!MAKE SURE TO ENABLE THIS ONCE WE DEPLOY. MAKES IT SO OUR SESSION ONLY WORKS OVER HTTPS.
    }
}; 

// ENABLES USE OF EXPRESS-SESSION
app.use(session(sessionOptions));
// ENABLES USE OF FLASHES, WHICH GIVES USER SUCCESS/FAILURE ALERTS
app.use(flash());
// ADDS HTML RESPONSE HEADERS
app.use(helmet({ contentSecurityPolicy: false }));

// ENABLES PASSPORT, WHICH IS USED FOR LOGINS AUTHENTICATION
app.use(passport.initialize());
// ENABLES PERSISTENT LOGIN SESSIONS. KEEPS YOU LOGGED IN FROM PAGE TO PAGE. DEPENDENT ON SESSION, SO ENSURE THIS COMES AFTER THE SESSION APP.USE
app.use(passport.session());
// TELLS PASSPORT TO USE THE LOCAL STRATEGY LIBRARY WE INSTALLED TO AUTHENTICATE THE USER MODEL/SCHEMA
passport.use(new LocalStrategy(User.authenticate()));
// TELLS PASSPORT HOW TO DE/SERIALIZE A USER
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ADDS A ONE-TIME req.flash(flashMessage) TO EVERY ROUTE. IF A flashMessage EXISTS, THEN IT WILL DISPLAY AT THE TOP OF THE PAGE
app.use((req, res, next) => {
    // console.log(req.query); // USED TO TEST IF MONGOSANITIZE IS WORKING. http://localhost:3000/?$gt=""
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user; // GETS USER INFORMATION FROM PASSPORT AND PASSES IT TO TEMPLATES (USERNAME AND EMAIL. NO PASSWORD HASH)
    next();
})

// AUTHENTICATION ROUTES. LOGIN, SIGNUP, LOG OUT
app.use('/', authRoutes);
// ANY URLS WITH /students WILL BE ROUTED TO ./routes/students.js
app.use('/students', studentsRoutes);
// IF :ID AND ATTENDANCE ADDED ON IT WILL ROUTE TO ./routes/attendance.js
app.use('/students/:id/attendance', attendanceRoutes);

// RENDERS HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
})

// DEFAULT ERROR PAGE WILL TRIGGER IF NO OTHER ROUTES HIT
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404)) // SEE THE ExpressError UTILITY
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