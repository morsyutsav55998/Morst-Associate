const mongoose = require('mongoose');
const providerSchema = new mongoose.Schema({
    service: {
        type: String
    },
    description: {
        type: String,
    },
    serviceimg: {
        type: Array,
    },
    providerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider',
    }
});
module.exports = mongoose.model('provider_service', providerSchema); 