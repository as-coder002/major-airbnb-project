if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();//for .env file 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");//for connect with mongoDB
const path = require("path");//this is nodejs built-in module so don't need to install it using npm
const methodOverride = require("method-override");//require method-override package
const session = require("express-session");//require express-session package
const { MongoStore } = require("connect-mongo");//for use mongo session store
const flash = require("connect-flash");//for show the flash meassage
const passport = require("passport");//for authentication
const LocalStrategy = require("passport-local");//for use local strategy
const User = require("./models/user.js");//require the user model
const listingRouter = require("./routes/listing.js");//for listing router access
const reviewRouter = require("./routes/review.js");//for review router access
const userRouter = require("./routes/user.js");//for user router access
const ExpressError = require("./utils/ExpressError.js");//require the custom built error class 

const port = 8080;//for server run on this port

//for connection ready to data base
main()
    .then((res) => {
        console.log("Connection successful with MongoDB Atlas");
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);//main method to connect with cloud mongodb database mongo atlas
}

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));// Set custom views folder path
app.use(express.static(path.join(__dirname, "public")));//set public folder path

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Optional: for JSON data
app.use(express.json());

//use method override package for handle PUT,PATCH & DELETE req
app.use(methodOverride("_method"));

//express-session all options
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    //for create mongo session storage
    store: MongoStore.create({
        mongoUrl: process.env.ATLASDB_URL,
        touchAfter: 24 * 3600,
    }),

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

//then actually call the express-session method for create session_id always
app.use(session(sessionOptions));

//use flash method for create flash meassge
app.use(flash());

//onn the passport method
app.use(passport.initialize());
app.use(passport.session());//this is use for to detect the coming request from similar session
passport.use(new LocalStrategy(User.authenticate()));//to say the passport for authentication use the user model

//most important after successful login this method is run
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for access the flash meassge variable in any ejs template without pass manually
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // current logged-in user
    res.locals.currUser = req.user;

    next();
});

//for user router access
app.use("/", userRouter);

//for listing router access
app.use("/listings", listingRouter);

//for review router access
app.use("/listings/:id/reviews", reviewRouter);

//for any undefine path this request have to be lock for throw the error "page not found"
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    res.status(statusCode).render("listing/error.ejs", { err });
});

//for server run
app.listen(port, () => {
    console.log(`server running on this port: ${port}`);
});