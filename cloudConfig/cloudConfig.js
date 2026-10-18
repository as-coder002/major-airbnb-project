const cloudinary = require("cloudinary").v2;//for use latest version
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//for connect the cloudinary server
cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,

    api_key: process.env.CLOUD_API_KEY,

    api_secret: process.env.CLOUD_API_SECRET,

});

//for create the storage into cloud
const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

        folder: "Wanderlust_DEV",

        allowed_formats: ["png", "jpg", "jpeg"],

    },

});

module.exports = {

    cloudinary, storage,

};