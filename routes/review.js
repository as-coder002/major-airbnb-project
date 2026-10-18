const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewController = require("../controllers/review.js");
const { reviewSchema } = require("../schemas.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


// REVIEW VALIDATION MIDDLEWARE
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// NEW REVIEW FORM ROUTE
router.get("/new", isLoggedIn, wrapAsync(reviewController.renderReviewForm));


// CREATE REVIEW ROUTE
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// DELETE REVIEW ROUTE
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


module.exports = router;