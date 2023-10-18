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
    add_btype,
    add_bcategory,
    add_bformation,
    add_bsubcategory,
    
    // Show B formation and type
    show_bformation,
    show_btype,

    // Category & Subcategory
    show_bcategory,
    // addbcategory,
    show_bsubcategory,
    subcatdata,
} = require('../controller/adminController')

router.post('/login', login)
router.get('/home', verifyToken, home)

// Provider
router.post('/addprovider', upload.array('documents'), addprovider)
router.get('/showproviders', verifyToken, showproviders)
router.delete('/deleteprovider/:id',verifyToken, deleteprovider)
// router.patch('/updateprovider',verifyToken,updateprovider)

// Add
router.post('/add_btype',add_btype)
router.post('/add_bcategory',add_bcategory)
router.post('/add_bformation',add_bformation)
router.post('/add_bsubcategory',add_bsubcategory)

// Show formation & type
router.get('/show_bformation',show_bformation)
router.get('/show_btype',show_btype)

router.get('/show_bcategory',show_bcategory)
// router.post('/addbcategory',verifyToken,addbcategory)
router.get('/show_bsubcategory',show_bsubcategory)
router.post('/subcatdata',subcatdata)

module.exports = router