const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    bussinesscategory: {
        type: String
    }
});

module.exports = mongoose.model('bussiness_category', adminSchema);