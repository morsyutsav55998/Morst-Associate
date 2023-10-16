const mongoose = require('mongoose')
const db = mongoose.connection
mongoose.connect('mongodb+srv://utsavgarchar:2616@cluster0.rd7wpk8.mongodb.net/Associate')

db.once('open',(err)=>{
     if(err){
          console.log(err);
          return false;
     }
     console.log('DB is connected');
})
