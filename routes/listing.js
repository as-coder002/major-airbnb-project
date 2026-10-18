const express = require("express");
const router = express.Router();//create router object

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listingController = require("../controllers/listing.js");
const { listingSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const multer = require('multer');//for parse the "multipart/form-data"
const { storage } = require("../cloudConfig/cloudConfig.js");//for access the cloud storage
const upload = multer({ storage });//for permanent store the access files into cloud storage


// LISTING VALIDATION MIDDLEWARE
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// INDEX + CREATE ROUTE
router.route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        upload.array("listing[image]", 5),
        validateListing,
        wrapAsync(listingController.createListing)
    );
// .post(upload.single("listing[image]"), wrapAsync(async(req,res) => {
//     res.send(req.file);
// }));

// CREATE NEW FORM ROUTE
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// SEARCH ROUTE
router.get(
    "/search",
    wrapAsync(listingController.searchListings)
);

// CATEGORY FILTER ROUTE
router.get(
    "/category/:category",
    wrapAsync(listingController.filterByCategory)
);

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

// SHOW + UPDATE + DELETE ROUTE
router.route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.fields([
            {
                name: "listing[image]",
                maxCount: 5
            },
            {
                name: "replaceImage0",
                maxCount: 1
            },
            {
                name: "replaceImage1",
                maxCount: 1
            },
            {
                name: "replaceImage2",
                maxCount: 1
            },
            {
                name: "replaceImage3",
                maxCount: 1
            },
            {
                name: "replaceImage4",
                maxCount: 1
            }
        ]),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

module.exports = router;