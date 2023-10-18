const mongoose = require('mongoose');
const providerSchema = new mongoose.Schema({
    // Provider
    name: { 
        type: String
    },
    email:{
        type:String
    },
    number:{
        type:String
    },
    BOD:{
        type:String
    },
    address:{
        type:String
    },
    // Bussiness
    Bname:{
        type:String
    },
    Bnumber:{
        type:String
    },
    Bemail:{
        type:String
    },
    Bsocialmedia:{
        type:Array
    },
    B_GSTnumber:{
        type:String
    },
    Btype:{
        type:String
    },
    Bdetails:{
        type:String
    },
    Btdsdetails:{
        type:String
    },
    Bpancardnumber:{
        type:String
    },
    Btype :{
        type:String
    },
    Bformation:{
        type:String,
    },
    bsubcategoryid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bussinesssubcategory',
    },
    Baddress:{
        type:String
    },
    collaborationDetails:{
        type:String
    },
    // Sales
    salespersonName:{
        type:String
    },
    salespersonNumber:{
        type:String
    },
    salespersonEmail:{
        type:String
    },
    salespersonPosition:{
        type:String
    },
    // Bank
    banknName:{
        type:String
    },
    bankAccountnumber:{
        type:String,
    },
    bankIFSCcode:{
        type:String
    },
    bankBranchname:{
        type:String
    },
    // Documents upload
    documents:{
        type:Array
    }
});

module.exports = mongoose.model('provider', providerSchema);