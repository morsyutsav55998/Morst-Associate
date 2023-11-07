const mongoose = require('mongoose')
const db = mongoose.connection
mongoose.connect('mongodb+srv://dharmik:Dharmik5599@cluster0.cnfcnth.mongodb.net/Affiliate')

db.once('open',(err)=>{
     if(err){
          console.log(err);
          return false;
     }
     console.log('DB is connected');
})
