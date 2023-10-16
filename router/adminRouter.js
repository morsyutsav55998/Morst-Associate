const express = require('express')
const router = express.Router()
const verifyToken = require('../JWT/adminjwt')
const upload = require('../middleware/multer')
const {
    login, // Admin Login
    home,  // Show admin data

    // Provider
    addprovider,
    showproviders,
    deleteprovider,
    // updateprovider,

    // Service 
    addservice,
    showservices,
    deleteservice,
    } = require('../controller/adminController')

router.post('/login',login)
router.get('/home',verifyToken,home)

// Provider
router.post('/addprovider',verifyToken,upload.array('documents'),addprovider)
router.get('/showproviders',verifyToken,showproviders)
router.delete('/deleteprovider/:id',verifyToken,deleteprovider)
// router.patch('/updateprovider',verifyToken,updateprovider)

// Service
router.post('/addservice',verifyToken,addservice)
router.get('/showservices',verifyToken,showservices)
router.delete('/deleteservice',verifyToken,deleteservice)

module.exports = router