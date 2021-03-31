const Homework = require('../models/homework');

// GET
module.exports.index = async (req, res) => {
    const homework = await Homework.find({});
    res.render('homework/index', { homework });
}

// GET
module.exports.renderHomeworkNew = (req, res) => { 
    res.render('homework/new');
}

// POST
module.exports.createHomework = async (req, res) => {
    const homework = new Homework(req.body.homework);
    await homework.save();
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
    if(!homework) { // SAY YOU BOOKMARKED A homework URL AND SOMEONE DELETES THAT homework AND YOU TRY TO RETURN TO THAT PAGE.
        req.flash('error', `Sorry, I couldn't find that homework. Was that assignment deleted?`); // FLASH A MESSAGE
        return res.redirect('/homework'); // SEND TO /homework RATHER THAN homework/edit. OTHERWISE IT WOULD SHOW A NASTY DEFAULT ERROR MESSAGE.
    }
    res.render('homework/edit', { homework });
}

//PUT
module.exports.updateHomework = async (req, res) => {
    const { id } = req.params; // PULLS THE homework ID FROM THE REQUEST PARAMETERS (URL)
    const homework = await Homework.findByIdAndUpdate(id, {...req.body.homework}, { new: true })
    req.flash('success', `Successfully updated ${homework.subjectLine}'s homework assignment `);
    res.redirect(`/homework/${homework.id}`);
}

//DELETE
module.exports.deleteHomework = async (req,res) => {
    const { id } = req.params; // PULLS THE Homework ID FROM THE REQUEST PARAMETERS (URL)
    const homework = await Homework.findById(id);
    await Homework.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${homework.firstName}'s homework assignment`);
    res.redirect('/homework');
}