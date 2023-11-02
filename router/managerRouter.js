var express = require('express')
var router = express.Router()
var verifyToken = require('../JWT/managerjwt')

var {
    login,
    home 
} = require('../controller/managerController')

router.post('/login',login)
router.get('/home',verifyToken,home)
module.exports = router