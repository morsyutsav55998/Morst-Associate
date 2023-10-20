const express = require('express')
const verifyToken = require('../JWT/providerjwt')
const router = express.Router()
const {
    login,
    home,
} = require('../controller/providerController')

router.post('/login',login)
router.get('/home',verifyToken,home)
// router.get('/logout',logout)
module.exports = router