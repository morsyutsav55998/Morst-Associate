const mongoose = require('mongoose');
const userformSchema = new mongoose.Schema({
    no:{
        type :Number,
    },
    name: {
        type: String
    },
    number: {
        type: String,
    },
    description:{
        type:String
    },
    productid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product',
    },
    name_:{
        type:String,
    },
    number:{
        type:String,
    }
});

module.exports = mongoose.model('userform', userForm); 