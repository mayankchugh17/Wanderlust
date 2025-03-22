const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');

module.exports.createReview = async (req, res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`)
};

module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});      //Here we are removing or delete the specific review (element) from Reviews (array in listing) through reviewId. 
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};