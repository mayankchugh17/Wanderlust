const express = require('express');
const router = express.Router({ mergeParams:true });
const wrapAsync = require('../utils/wrapAsync.js');
const reviewController = require('../controllers/reviews.js');
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware.js');



// Review Route

router.post('/',isLoggedIn , validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
// Here :id is for listings ID and :reviewsId is for Id of Review which is being used for deleting the particular review from specific listing.

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router; 