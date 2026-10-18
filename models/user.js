const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

// plugin add cause it's automatically add username, hash, salting value filed and also provide some methods 
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;