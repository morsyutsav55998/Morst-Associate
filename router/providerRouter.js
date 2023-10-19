const express = require('express')
const router = express.Router()
const {
    login,
} = require('../controller/providerController')

router.post('/login',login)
module.exports = router 