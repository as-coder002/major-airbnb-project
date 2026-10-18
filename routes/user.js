const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//SIGNUP FORM RENDER & SIGNUP HANDLE ROUTE
router.route("/signup")

    .get(userController.renderSignupForm)

    .post(
        wrapAsync(userController.signup)
    );

//LOGIN FORM RENDER & LOGIN HANDLE ROUTE    
router.route("/login")

    .get(userController.renderLoginForm)

    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// LOGOUT ROUTE
router.get("/logout", userController.logout );

module.exports = router;