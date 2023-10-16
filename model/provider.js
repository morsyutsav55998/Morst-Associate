const mongoose = require('mongoose');
const providerSchema = new mongoose.Schema({
    // Provider
    providername: { 
        type: String
    },
    provideremail:{
        type:String
    },
    providernumber:{
        type:String
    },
    providerbod:{
        type:String
    },
    provideraddress:{
        type:String
    },
    // Bussiness
    bussinessname:{
        type:String
    },
    bussinessnumber:{
        type:String
    },
    bussinessemail:{
        type:String
    },
    bussinesswebsite:{
        type:String
    },
    bussinessgstnumber:{
        type:String
    },
    bussinesstype:{
        type:String
    },
    bussinessdetails:{
        type:String
    },
    bussinesstdsdetails:{
        type:String
    },
    bussinesspancardnumber:{
        type:String
    },
    bussinesscategory:{
        type:String
    },
    bussinessaddress:{
        type:String
    },
    collaborationdetails:{
        type:String
    },
    // Sales
    salespersonname:{
        type:String
    },
    salespersonnumber:{
        type:String
    },
    salespersonemail:{
        type:String
    },
    salespersonposition:{
        type:String
    },
    // Bank
    bankname:{
        type:String
    },
    bankaccountnumber:{
        type:String,
    },
    bankifsccode:{
        type:String
    },
    bankbranchname:{
        type:String
    },
    // Documents upload
    documents:{
        type:Array
    }
});

module.exports = mongoose.model('provider', providerSchema);