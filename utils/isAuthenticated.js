module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) { //isAuthenticated IS A PASSPORT FUNCTION
        req.session.returnTo = req.originalUrl; // SAVES THE ORIGINAL URL SO THAT WE CAN RETURN THE USER BACK TO THE PAGE THEY CAME FROM BEFORE HITTING THE LOGIN ROUTE.
        req.flash('error', 'You must first sign in before you can view that page');
        return res.redirect('/login');
    }
    next();
}