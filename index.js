const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('./middleware/mongoose')
const path = require('path')


app.use(express.static(path.join(__dirname,'files')))
app.use(express.static(path.join(__dirname,'sample')))
require('dotenv').config()
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended : true
}))


app.use('/admin',require('./router/adminRouter'))
app.use('/provider',require('./router/providerRouter'))

app.get('/success',(req,res)=>{
    res.send('😊')
})

app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Server is running on port",3000);
}) 