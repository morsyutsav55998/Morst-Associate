const express = require('express')
const verifyToken = require('../JWT/providerjwt')
const upload = require('../middleware/multer')
const router = express.Router()
const {
    login,
    home,

    addservice,
    showservices,
} = require('../controller/providerController')

router.post('/login',login)
router.get('/home',verifyToken,home)

router.post('/addservice',verifyToken,upload.array('serviceimg'),addservice)
router.get('/showservices',verifyToken,showservices) 
module.exports = router 