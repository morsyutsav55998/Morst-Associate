const mongoose = require('mongoose');
const managerSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('manager', managerSchema); 