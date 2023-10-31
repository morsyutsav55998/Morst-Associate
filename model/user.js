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
    password:{
        type:String,
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
    ref_no:{
        type:Number,
    },
    address:{
        type:String,
    },
    ids:{
        type:Number
    }
});

module.exports = mongoose.model('user', userSchema); 