const mongoose = require('mongoose')
const db = mongoose.connection
mongoose.connect('mongodb+srv://utsavgarchar:2616@cluster0.rd7wpk8.mongodb.net/Affiliate')
// mongoose.connect('mongodb://127.0.0.1/Associate')

db.once('open',(err)=>{
     if(err){
          console.log(err);
          return false;
     }
     console.log('DB is connected');
})
