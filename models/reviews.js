const mongoose = require('mongoose');
const Listing = require('./listing');
const Schema = mongoose.Schema;

// Creating review Schema

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type: Number,
        min:1,
        max:5
    },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User" 
    }
});



// Creating Model of Review and Export into app.js

const Review = mongoose.model("Review", reviewSchema); 
module.exports = Review;