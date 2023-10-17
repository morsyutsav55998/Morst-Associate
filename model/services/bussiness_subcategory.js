const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    bcategoryid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bussiness_category',
   },
    bussinesssubcategory: {
        type: String
    }
});

module.exports = mongoose.model('bussiness_subcategory', adminSchema);