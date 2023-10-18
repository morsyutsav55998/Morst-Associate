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

    // Add
    add_servicetype,
    add_bcategory,
    add_bformation,
    add_bsubcategory,
    
    // Category
    show_bcategory,
    // addbcategory,
    show_bsubcategory,
    subcatdata,
} = require('../controller/adminController')

router.post('/login', login)
router.get('/home', verifyToken, home)

// Provider
router.post('/addprovider', verifyToken, upload.array('documents'), addprovider)
router.get('/showproviders', verifyToken, showproviders)
router.delete('/deleteprovider/:id', verifyToken, deleteprovider)
// router.patch('/updateprovider',verifyToken,updateprovider)


// One by one add
// Add
router.post('/add_servicetype',add_servicetype)
router.post('/add_bcategory',add_bcategory)
router.post('/add_bformation',add_bformation)
router.post('/add_bsubcategory',add_bsubcategory)

router.get('/show_bcategory',show_bcategory)
// router.post('/addbcategory',verifyToken,addbcategory)
router.get('/show_bsubcategory',show_bsubcategory)
router.post('/subcatdata',subcatdata)

module.exports = router