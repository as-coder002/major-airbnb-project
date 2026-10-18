//THIS IS MAIN FILE FOR DATA INSERT
const mongoose = require("mongoose");
let { sampleListings } = require("./sampleData.js");//require the whole sample data
const Listing = require("../models/listing.js");//require the model

//for connection ready to data base
main()
    .then((res) => {
        console.log("Connection successful with mongodb server");
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');//main method to connect with mongodb database
}

//MAIN FUNCTION FOR DATA INSERT INTO DB
const initDB = async () => {
  await Listing.deleteMany({});//first clean all old data from data base
  const updatedListings = sampleListings.map((obj) => ({...obj, owner: '6a2d9af96ec9fe378755824b'}));//for add owner for each listing
  await Listing.insertMany(updatedListings);//secondly insert the whole data into db
  console.log("Database Insert successfully");
};

initDB();