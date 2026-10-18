const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudConfig/cloudConfig.js");
const geocodeLocation = require("../utils/geocoding.js");

// INDEX ROUTE
module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listing/index.ejs", {
        allListings,
        selectedCategory: null
    });

};

// FILTER LISTINGS BY CATEGORY
module.exports.filterByCategory = async (req, res) => {

    const { category } = req.params;

    const filteredListings = await Listing.find({
        category: category.toLowerCase()
    });

    if (filteredListings.length === 0) {
        return res.render("listing/index.ejs", {
            allListings: [],
            selectedCategory: category
        });
    }

    res.render("listing/index.ejs", {
        allListings: filteredListings,
        selectedCategory: category
    });

};

// SEARCH LISTINGS
module.exports.searchListings = async (req, res) => {

    const { q } = req.query;

    const searchQuery = q ? q.trim() : "";

    const searchRegex = new RegExp(searchQuery, "i");

    const searchResults = await Listing.find({
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { category: searchRegex }
        ]
    });

    res.render("listing/index.ejs", {
        allListings: searchResults,
        selectedCategory: null
    });

};

// NEW ROUTE
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

// CREATE ROUTE
module.exports.createListing = async (req, res) => {

    // Get coordinates from listing location and country
    const coordinates = await geocodeLocation(
        req.body.listing.location,
        req.body.listing.country
    );

    const newListing = new Listing(req.body.listing);

    // Add logged-in user as owner
    newListing.owner = req.user._id;


    // ==========================================
    // STORE MULTIPLE IMAGES
    // ==========================================

    newListing.image = req.files.map((file) => ({

        url: file.path,
        filename: file.filename

    }));


    // ==========================================
    // STORE COORDINATES
    // ==========================================

    if (coordinates) {

        newListing.geometry = {

            type: "Point",

            coordinates: [
                coordinates.longitude,
                coordinates.latitude
            ]

        };

    }


    // Save listing
    await newListing.save();


    req.flash(
        "success",
        "New listing created successfully!"
    );

    res.redirect("/listings");

};

// EDIT ROUTE
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listing/edit.ejs", { listing });
};

// UPDATE ROUTE
module.exports.updateListing = async (req, res) => {

    const { id } = req.params;

    // Find listing
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }


    // ==========================================
    // UPDATE LISTING INFORMATION
    // ==========================================

    Object.assign(listing, req.body.listing);


    // ==========================================
    // UPDATE LOCATION COORDINATES
    // ==========================================

    const coordinates = await geocodeLocation(
        req.body.listing.location,
        req.body.listing.country
    );

    if (coordinates) {

        listing.geometry = {
            type: "Point",
            coordinates: [
                coordinates.longitude,
                coordinates.latitude
            ]
        };

    }


    // ==========================================
    // NEW IMAGES
    // ==========================================

    const newImages =
        req.files?.["listing[image]"] || [];


    // ==========================================
    // ADD NEW IMAGES TO LISTING
    // ==========================================

    for (const file of newImages) {

        listing.image.push({
            url: file.path,
            filename: file.filename
        });

    }

    // ==========================================
    // REPLACE EXISTING IMAGES
    // ==========================================

    for (let i = 0; i < listing.image.length; i++) {

        const replaceField = `replaceImage${i}`;

        const replacementFile =
            req.files?.[replaceField]?.[0];

        if (replacementFile) {

            // Delete old image from Cloudinary
            if (listing.image[i]?.filename) {

                await cloudinary.uploader.destroy(
                    listing.image[i].filename
                );

            }

            // Replace old image with new image
            listing.image[i] = {
                url: replacementFile.path,
                filename: replacementFile.filename
            };

        }

    }


    // ==========================================
    // SAVE LISTING
    // ==========================================

    await listing.save();


    res.redirect(`/listings/${id}`);

};

// DELETE ROUTE
module.exports.destroyListing = async (req, res) => {

    const { id } = req.params;

    // Find listing before deleting it
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }


    // ==========================================
    // DELETE ALL IMAGES FROM CLOUDINARY
    // ==========================================

    if (listing.image && listing.image.length > 0) {

        for (const image of listing.image) {

            if (image.filename) {

                await cloudinary.uploader.destroy(
                    image.filename
                );

            }

        }

    }


    // ==========================================
    // DELETE LISTING FROM MONGODB
    // ==========================================

    await Listing.findByIdAndDelete(id);


    // ==========================================
    // SUCCESS MESSAGE
    // ==========================================

    req.flash(
        "success",
        "Listing Deleted Successfully!"
    );

    res.redirect("/listings");

};

// SHOW ROUTE
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        });

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listing/show.ejs", { listing });
};