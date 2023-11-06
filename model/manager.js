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
    password: {
        type: String,
    },
    orderids: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('manager', managerSchema); 