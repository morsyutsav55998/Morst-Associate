const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    number: {
        type: String,
    },
    DOB: {
        type: String,
    },
    occupation:{
        type: String,
    },
    reference:{
        type:String,
    },
    address:{
        type:String,
    }
});

module.exports = mongoose.model('user', userSchema); 