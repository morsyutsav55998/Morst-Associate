const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('./middleware/mongoose')
const helmet = require('helmet')
const path = require('path')

// Static for files
app.use(express.static(path.join(__dirname, 'files')))
app.use(express.static(path.join(__dirname, 'sample')))

// Call functions

require('dotenv').config()
app.use(helmet())
app.disable("x-powered-by");
app.use(
  helmet({
    xPoweredBy: false,
    xXssProtection: false,
  })
);
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

// Routes
app.use('/user', require('./router/userRouter'))
app.use('/admin', require('./router/adminRouter'))
app.use('/provider', require('./router/providerRouter'))
app.use('/manager',require('./router/managerRouter'))
app.get('/', (req, res) => {
 res.json({
  message :req.cookies
 })
})

// Server
app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port", 3000);
})