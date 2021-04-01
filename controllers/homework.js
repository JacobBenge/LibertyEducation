const Homework = require('../models/homework');
const Student = require('../models/student');

// GET
module.exports.index = async (req, res) => {
    const homework = await Homework.find({});
    res.render('homework/index', { homework });
}

// GET
module.exports.renderHomeworkNew = async (req, res) => { 
    const students = await Student.find({}); // PASS ALL STUDENTS TO NEW HOMEWORK PAGE SO WE CAN SELECT AN ASSIGNED STUDENT
    res.render('homework/new', { students });
}

// POST
module.exports.createHomework = async (req, res) => {
    let hw = req.body.homework; // RETREIVE USER INPUT FROM BODY
    hw.createdBy = req.user.username; // ADD THE NAME OF THE PERSON THAT CREATED THE HOMEWORK
    hw.createDate = new Date(Date.now()); // ADD THE DATE THE HOMEWORK WAS ORIGINALLY CREATED
    hw.dueDate = new Date(hw.dueDate);
    const assignedStu = await Student.findById(hw.stuId); // LOOKUP THE ASSIGNED STUDENT IN DB WITH THE stuId provided
    hw.assignedStudent = `${assignedStu.firstName} ${assignedStu.lastName}`; // ADD AN ADDITIONAL KEY/VALUE PAIR TO THE HOMEWORK OBJECT
    const homework = new Homework(hw);  // VALIDATE HW OBJECT AGAINST THE SCHEMAS
    await homework.save(); // SAVE THE HOMEWORK OBJECT TO THE DB
    req.flash('success', `Successfully created a homework assignment for ${homework.subjectLine}`); // FLASH IS USED TO PASS A ONE-TIME MESSAGE TO THE NEXT PAGE LOAD FOR A FLASH MESSAGE
    res.redirect(`/homework/${homework._id}`)
}

// GET
module.exports.renderHomeworkShow = async (req, res) => {
    const homework = await Homework.findById(req.params.id)
    if(!homework) { // SAY YOU BOOKMARKED A homework URL AND SOMEONE DELETES THAT homework AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that homework. Was that assignment deleted?`); // FLASH A MESSAGE
        return res.redirect('/homework'); // SEND TO /homework RATHER THAN homework/show. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('homework/show', { homework }); 
}

//GET
module.exports.renderHomeworkEdit = async (req, res) => {
    const { id } = req.params;
    const homework = await Homework.findById(id);
    const students = await Student.find({});
    if(!homework) { // SAY YOU BOOKMARKED A homework URL AND SOMEONE DELETES THAT homework AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that homework. Was that assignment deleted?`); // FLASH A MESSAGE
        return res.redirect('/homework'); // SEND TO /homework RATHER THAN homework/edit. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('homework/edit', { homework, students }); // NEED students BECAUSE OF THE WAY THE EDIT FORM LOADS THE EXISTING INFO
}

//PUT
module.exports.updateHomework = async (req, res) => {
    const { id } = req.params; // PULLS THE homework ID FROM THE REQUEST PARAMETERS (URL)
    const homework = req.body.homework;
    homework.lastModifiedBy = req.user.username; // GRAB THE USERNAME OF THE PERSON WHO UPDATED
    homework.lastModifiedDate = new Date(Date.now()); // ADD THE MODIFIED DATE
    const homeworkFull = await Homework.findByIdAndUpdate(id, {...req.body.homework}, { new: true })
    req.flash('success', `Successfully updated ${homeworkFull.assignedStudent}'s homework assignment `);
    res.redirect(`/homework/${homeworkFull.id}`);
}

//DELETE
module.exports.deleteHomework = async (req,res) => {
    const { id } = req.params; // PULLS THE Homework ID FROM THE REQUEST PARAMETERS (URL)
    const homework = await Homework.findById(id);
    await Homework.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${homework.assignedStudent}'s homework assignment`);
    res.redirect('/homework');
}