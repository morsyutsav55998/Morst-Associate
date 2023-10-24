const express = require('express')
const router = express.Router()
const verifyToken = require('../JWT/userjwt')
const {
    // register,
    login,
    
    allprovider,
    search,
    // service_details,
} = require('../controller/userController')

// router.post('/register',register)
router.post('/login',login)
router.get('/allprovider',verifyToken,allprovider)
router.post('/search',search)
// router.get('/service_details')

module.exports = router