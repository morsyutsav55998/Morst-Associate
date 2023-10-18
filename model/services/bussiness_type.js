const mongoose = require('mongoose');
const busssinesstypeSchema = new mongoose.Schema({
    busssiness_type: {
        type: String
    }
});

module.exports = mongoose.model('busssinesstype', busssinesstypeSchema);