const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('./middleware/mongoose')

require('dotenv').config()
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser())
app.use(express.urlencoded())

app.use('/admin',require('./router/adminRouter'))

app.get('/get',(req,res)=>{
    res.send('Done')
})

app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Server is running on port",3000);
})