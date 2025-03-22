const User = require('../models/user.js');      //User model File

module.exports.renderSignupPage = (req, res)=>{
    res.render('users/signup.ejs');
};

module.exports.userRegistration = async(req, res)=>{
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);   //User.register(newUser, password) method is provided by Passport-local-mongoose. This is used to store document in collection of Mongo DB with Hashed form.     
        
        req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
            req.flash(`success`,`Welcome to Wanderlust! ${registeredUser.username}`);
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginPage = (req, res)=>{
    res.render('users/login.ejs');
};

module.exports.redirectAfterLogin = async(req, res)=>{          //This is the passport middleware which is being used for authentication 
    req.flash("success","Welcome to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect( redirectUrl );
};

module.exports.logOut = (req, res, next)=>{
    req.logOut((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};