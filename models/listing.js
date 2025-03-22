const mongoose = require('mongoose');
const Review = require('./reviews.js');
const Schema = mongoose.Schema;

// Define the schema for the listings collection
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: String,
        url: String,
    },  
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",       //Review is Model
        }
    ], 
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"              //User is also Model
    },
    category : {
        type: String,
        enum: ["mountains","arctic","farms","deserts"]
    }
});

// When the existing listing will be deleted then Reviews will also be deleted thats why we are using Mongoose POST middleware 

listingSchema.post("findOneAndDelete",async(listing)=>{          //This Mongoose Delete Middleware will be executed when Delete listings Route will be called 
    if(listing)
    {
        await Review.deleteMany({_id :{$in: listing.reviews}})      //listing is an object and reviews is an array 
    }            
})

// Create a model for the listings collection
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
