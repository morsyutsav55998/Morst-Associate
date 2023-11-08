var express = require('express')
var router = express.Router()

var {
    login,
    accept_order, 
} = require('../controller/paymentController')

router.post('/login',login)
router.get('/accept_order',accept_order)
module.exports = router