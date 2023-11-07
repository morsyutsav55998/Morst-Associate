var express = require('express')
var router = express.Router()

var {
    login
} = require('../controller/paymentController')

router.post('/login',login)

module.exports = router