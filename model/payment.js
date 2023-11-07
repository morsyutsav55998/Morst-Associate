const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    number: {
        type: String,
    },
    password: {
        type: String,
    },
})

module.exports = mongoose.model('payment', paymentSchema); 