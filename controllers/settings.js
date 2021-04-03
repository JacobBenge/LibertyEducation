const SettingsModel = require('../models/settings');

// GET
module.exports.index = async (req, res) => {
    try{
        const settings = await Settings.find({}); // IF THERE IS NO SETTINGS ALREADY SAVED IN DB, THEN AN ERROR IS THROWN.
        res.render('settings/index', { settings });
    } catch(e){
        req.flash('error', `No settings were found in database.`)
        res.render('settings/index');
    }
}

//GET
module.exports.renderSettingsEdit = async (req, res) => {
    try{
        const settings = await Settings.find({}); // IF THERE IS NO SETTINGS ALREADY SAVED IN DB, THEN AN ERROR IS THROWN.
        res.render('settings/edit', { settings });
    } catch(e){
        req.flash('error', `No settings were found in database.`)
        res.render('settings/edit');
    }
}

//PUT
module.exports.updateSettings = async (req, res) => {
    var settings = req.body.settings;
    // settings.lastModifiedBy = req.user.username; // GRAB THE USERNAME OF THE PERSON WHO UPDATED
    // settings.lastModifiedDate = new Date(Date.now()); // ADD THE MODIFIED DATE
    const doc =  await SettingsModel.create({}) // CRAP IT ISN'T VALIDATING AND THEREFORE IT ONLY HAS THE DEFAULT LAST MODIFIED VALUE. I DOES SAVE WITH THIS THOUGH
    console.log(doc);
    await doc.save(); // SAVE THE DOC TO THE DATABASE
    req.flash('success', 'Successfully updated site settings!');
    res.redirect('/settings');
}