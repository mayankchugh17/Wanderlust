const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


// Note in User Schema we don't need to add field of user's name and password manually because (passport-local-mongoose)
// automatically creates both field with Salting and Hashing

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
});

userSchema.plugin(passportLocalMongoose);

const User =  mongoose.model('User',userSchema);
module.exports = User;
