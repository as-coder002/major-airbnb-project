//this file is completely for create modules or collections and schema define
const mongoose = require('mongoose');
const Review = require("./review.js");

//schema define for listing collections
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: [
        {
            url: String,
            filename: String,
        }
    ],
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    //this is for storing map coordinates using GeoJSON
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    //this is for review model reference
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    //this is for store owner data and reference the User model
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

//this is mongoose middleware for delete reviews
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});

//create a model or collection and who follow this schema
const Listing = mongoose.model("Listing", listingSchema);

//then export this model
module.exports = Listing;