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
    // Bank Detail
    bankname:{
        type:String,
    },
    bankaccount:{
        type:String,
    },
    bankifsc:{
        type:String,
    },
    bankbranch:{
        type:String,
    },
    upiid:{
        type:String,
    },
    ids:{
        type:Number
    }
},{
    timestamps: true
  });

module.exports = mongoose.model('user', userSchema); 