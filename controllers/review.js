const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

// Render Review Form
module.exports.renderReviewForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("review/new.ejs", { listing });
};

// Create Review
module.exports.createReview = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    const review = new Review(req.body.review);

    // Current logged-in user becomes review author
    review.author = req.user._id;

    listing.reviews.push(review);

    await review.save();
    await listing.save();
    req.flash("success", "Review added successfully!");//for show the flash msg

    res.redirect(`/listings/${id}`);
};

// Delete Review
module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    // Remove review reference from Listing
    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId,
        },
    });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
};