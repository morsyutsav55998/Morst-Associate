const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    bussinessformation: {
        type: String
    }
});

module.exports = mongoose.model('bussiness_formation', adminSchema);