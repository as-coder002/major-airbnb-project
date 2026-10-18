const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

//ALL MIDDLEWARES ARE HERE
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        // Save the original URL
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in first!");

        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl = req.session.redirectUrl;

    }

    next();
};

//this middleware for listing model authorization
module.exports.isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

//this is for review model authorization
module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {

        req.flash("error", "Review not found!");

        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {

        req.flash("error", "You don't have permission to delete this review!");

        return res.redirect(`/listings/${id}`);
    }

    next();

};