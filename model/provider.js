const mongoose = require('mongoose');
const providerSchema = new mongoose.Schema({
    orderids:[{
        type : mongoose.Schema.Types.ObjectId,
    }],
    // Provider
    profile:{
        type : String,
    },
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
    product_service:{
        type:Array,
    },
    // Bussiness
    Bname:{
        type:String
    },
    Bnumber:{
        type:String
    },
    password:{
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
    Bformation:{
        type:String,
    },
    bsubcategoryid:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bussinesssubcategory',
    }],
    b_brochure:{
        type:String,
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
    bankName:{
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
    adharcard:{
        type:String,
    },
    pancard:{
        type:String,
    },
    gstfile:{
        type:String,
    },
    tdsfile:{
        type:String,
    },
    agreementfile:{
        type:String,
    }
});
module.exports = mongoose.model('provider', providerSchema);

