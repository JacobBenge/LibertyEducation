const Student = require('../models/student');

// GET
module.exports.index = async (req, res) => { // isAuthenticated IS A MIDDLEWARE FUNCTION THAT USES THE PASSPORT FUNCTION (isAuthenticated()) TO SEE IF USER IS LOGGED IN. IF NOT IT ROUTES TO LOGIN PAGE.
    const students = await Student.find({});
    res.render('students/index', { students});
}

// GET
module.exports.renderStudentNew = (req, res) => { 
    res.render('students/new');
}

// POST
module.exports.createStudent = async (req, res) => {
    const student = new Student(req.body.student);
    student.author = req.user._id; // TAKES THE USERNAME OF THE CURRENTLY LOGGED IN ACCOUNT AND SAVES IT AS THE AUTHOR.
    await student.save();
    req.flash('success', `Successfully created a student profile for ${student.firstName}`); // FLASH IS USED TO PASS A ONE-TIME MESSAGE TO THE NEXT PAGE LOAD FOR A FLASH MESSAGE
    res.redirect(`/students/${student._id}`)
}

// GET
module.exports.renderStudentShow = async (req, res) => {
    const student = await Student.findById(req.params.id).populate({
        path:'attendance', // POPULATE ALL THE ATTENDANCE
        populate: {
            path: 'author' // POPULATE ALL THE AUTHORS FOR EACH ATTENDANCE
        }
    }).populate('author'); // LOADS ALL INFORMATION ABOUT THE STUDENT FROM MONGODB USING THE ID GIVEN IN THE URL. THEN POPULATES THE ATTENDANCE BY USING THE OBJECTIDS IN THE ATTENDANCE ARRAY. SAME FOR THE AUTHOR.
    if(!student) { // SAY YOU BOOKMARKED A STUDENT URL AND SOMEONE DELETES THAT STUDENT AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that student. Was that profile deleted?`); // FLASH A MESSAGE
        return res.redirect('/students'); // SEND TO /students RATHER THAN students/show. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('students/show', { student }); 
}

//GET
module.exports.renderStudentEdit = async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    if(!student) { // SAY YOU BOOKMARKED A STUDENT URL AND SOMEONE DELETES THAT STUDENT AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that student. Was that profile deleted?`); // FLASH A MESSAGE
        return res.redirect('/students'); // SEND TO /students RATHER THAN students/edit. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('students/edit', { student });
}

//PUT
module.exports.updateStudent = async (req, res) => {
    const { id } = req.params; // PULLS THE STUDENT ID FROM THE REQUEST PARAMETERS (URL)
    const student = await Student.findByIdAndUpdate(id, {...req.body.student}, { new: true })
    req.flash('success', `Successfully updated ${student.firstName}'s student profile`);
    res.redirect(`/students/${student.id}`);
}

//DELETE
module.exports.deleteStudent = async (req,res) => {
    const { id } = req.params; // PULLS THE STUDENT ID FROM THE REQUEST PARAMETERS (URL)
    const student = await Student.findById(req.params.id);
    await Student.findByIdAndDelete(id); // ALSO TRIGGERS CASCADE DELETE OF RELATED ATTENDANCE. SEE student.js line 20
    req.flash('success', `Successfully deleted ${student.firstName}'s student profile`);
    res.redirect('/students');
}