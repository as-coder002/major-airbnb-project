const User = require("../models/user");

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

// Signup User
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        //this method use for automatic login system after successfully sign up
        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash("success", `Welcome to Wanderlust, ${registeredUser.username}!`);

            res.redirect("/listings");

        });

    } catch (err) {

        req.flash("error", err.message);
        res.redirect("/signup");

    }

};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

// Login User
module.exports.login = async (req, res) => {

    req.flash("success", `Welcome back, ${req.user.username}!`);

    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);

};

// Logout User
module.exports.logout = (req, res, next) => {

    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged out successfully!");

        res.redirect("/listings");
    });

};