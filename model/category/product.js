const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    bsubcategoryid:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bussinesssubcategory',
    }],
    product:{
        type:String,
    },
});

module.exports = mongoose.model('products', productSchema);