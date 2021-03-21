const Student = require('../models/student');
const Note = require('../models/note');

// POST
module.exports.createNote = async (req, res) => {
    const student = await Student.findById(req.params.id);
    const note = new Note(req.body.note); // USE THE NOTE MODEL TO CREATE AN NOTE OBJECT
    student.note.push(note); // ADD THE NOTE OBJECT ID TO THE NOTE ARRAY UNDER THE STUDENT OBJECT
    await note.save(); // SAVE THE NOTE ITSELF
    await student.save(); // SAVE THE STUDENT
    req.flash('success', `Successfully added note for ${student.firstName}`);
    res.redirect(`/students/${student._id}`);
}
// DELETE
module.exports.deleteNote = async (req, res) => {
    const { id, noteId} = req.params;
    const student = await Student.findById(req.params.id); // FIND THE STUDENT IN THE DATABASE
    await Student.findByIdAndUpdate(id, {$pull: { note: noteId}  }); // REMOVES OBJECT ID FOR THE SPECIFIED NOTE
    req.flash('success', `Successfully deleted note for ${student.firstName}`);
    res.redirect(`/students/${id}`);
}