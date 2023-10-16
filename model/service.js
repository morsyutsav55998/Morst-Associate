const mongoose = require('mongoose')
const serviceSchema = new mongoose.Schema({
    servicedetail:{
        type:String,
    },
    servicetype :{
        type:String,
    },
    bussinessformation:{
        type:String,
    },
    bussinesscategory:{
        type:String,
    },
    bussinesssubcategory:{
        type:String,
    }
})

module.exports = mongoose.model('service', serviceSchema);