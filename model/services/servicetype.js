const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    servicetype: {
        type: String
    }
});

module.exports = mongoose.model('servicetype', adminSchema);