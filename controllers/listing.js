// Controllers is used for taking callbacks.

const Listing = require('../models/listing.js');

// Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(req.params.id)
    // Populate the owner field
    .populate("owner")
    // Populate the reviews field
        .populate({
            path: 'reviews',
            populate: {
                path: 'author', // Populate the author field in reviews
            },
        });

    if (!listing) {
        req.flash('error', "Listing doesn't exist!");
        return res.redirect('/listings');
    }

    res.render('listings/show.ejs', { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;                //req.file is the method of multer package
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing doesn't exists!");
        res.redirect("/listings");
    }

    let orginalImageUrl = listing.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { listing, orginalImageUrl});
};

module.exports.listingUpdate = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }) // Deconstructing is being done for access the values
        if(typeof req.file !== "undefined")         //This block of code will allow to upload file from edit page.
        {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash("success","Listing has been updated!");
        res.redirect(`/listings/${id}`);
};

module.exports.listingDelete = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id) // Mongoose Deleted Middleware will be executed here
    .then(() => {
            req.flash("success","Listing has been deleted!");
            res.redirect("/listings");
        });
};