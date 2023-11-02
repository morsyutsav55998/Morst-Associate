var express = require('express')
var router = express.Router()
var verifyToken = require('../JWT/managerjwt')

var {
    login,
    home,
    
    showorders,

} = require('../controller/managerController')

router.post('/login',login)
router.get('/home',verifyToken,home)

router.get('/showorders',verifyToken,showorders)
module.exports = router