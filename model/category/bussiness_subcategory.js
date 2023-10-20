const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    bcategoryid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bussinesscategory',
        require : true,
   },
    bussinesssubcategory: {
        type: String
    }
});

module.exports = mongoose.model('bussinesssubcategory', adminSchema);