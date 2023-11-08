var express = require('express')
var router = express.Router()

var {
    login,
    accept_order,
    order_detail,
    done_order,
    comission_total
} = require('../controller/paymentController')

router.post('/login',login)
router.get('/accept_order',accept_order)
router.get('/order_detail/:id',order_detail)
router.get('/done_order',done_order)
router.get('/comission_total',comission_total)
module.exports = router