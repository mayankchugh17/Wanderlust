const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { cloudinary, storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Index Route
router.route('/')
.get(wrapAsync(listingController.index))      //listingController is the controller where index() is the method.
// Create Route using POST method
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));

// New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
// Show Route
.get(wrapAsync(listingController.showListing))
// Update Route
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.listingUpdate))
// Delete Route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.listingDelete));

// Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;