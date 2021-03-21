const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGE PARAMS ALLOWS THIS ROUTER TO ACCESS PARAMETERS THAT ARE EARLIER IN THE URL (SUCH AS THE ID). WITHOUT THIS WE CANNOT ACCESS THE ID IN THE URL 
const catchAsync = require('../utils/catchAsync');
const { isAuthenticated, isAdmin, validateNote } = require('../middleware/middleware');
const noteController = require('../controllers/note');

// SAVES THE NOTE IN THE NOTE COLLECTION AND ADDS THE NOTEID TO THE STUDENT OBJECT FOR REFERENCE
router.post('/', isAuthenticated, validateNote, catchAsync(noteController.createNote))

// TRIGGERED BY DELETE BUTTON ON NOTE. DELETES THE NOTE ITSELF AND THE NOTEID ON THE STUDENT OBJECT.
router.delete('/:noteId', isAuthenticated, isAdmin, catchAsync(noteController.deleteNote))

module.exports = router;