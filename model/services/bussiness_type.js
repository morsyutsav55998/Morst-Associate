const mongoose = require('mongoose');
const busssinesstypeSchema = new mongoose.Schema({
    btype: {
        type: String
    }
});

module.exports = mongoose.model('busssinesstype', busssinesstypeSchema);