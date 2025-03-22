require('dotenv').config(); 
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingsRoute = require('./routes/listing.js');
const reviewsRoute = require('./routes/reviews.js');
const userRoute = require('./routes/user.js');

const port = 8080;

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));       //Static method is used to serve backend files (HTML,CSS, JS) to Frontend.

// Options or properties of session

const sessionOptions = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        // Expires and maxAge are same and the HTTPOnly  is used for security reasons
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,         // It takes values in miliseconds
        maxAge  : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true 
    }
}

app.use(session(sessionOptions));   
app.use(flash());

app.use(passport.initialize());     //For Initializing the passport
app.use(passport.session());                      //For identify the same session on each interaction by an user
passport.use(new LocalStrategy(User.authenticate()));   //This is used for authentication of each users by their username and password using passport.
passport.serializeUser(User.serializeUser());       // Serialize means putting user's information into session.
passport.deserializeUser(User.deserializeUser());       // Deserialize means removing user's information from session.


// Connect-flash Middleware

app.use((req, res, next)=>{
    res.locals.success =  req.flash("success");
    res.locals.error =  req.flash("error");
    res.locals.currUser = req.user;     //(req.user) is the Passport's object which gives an information about current session handler (user);
    next();
});

app.use("/listings", listingsRoute);         //When /Listings request will be come then this Middleware will be used 
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/signup", userRoute);         //When /Listings request will be come then this Middleware will be used 

// Server will be started

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
});

// REST APIs

// app.get('/', (req, res) => {
//     res.send('I am Root');
// });

// Middlewares

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Internal Server Error" } = err;       //We are giving default values to statusCode and message so that If we dont give value manually It will take it by Default.
    res.render("listings/error.ejs",{ err });
});
