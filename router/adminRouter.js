const express = require('express')
const router = express.Router()
const verifyToken = require('../JWT/adminjwt')
const userverifyToken = require('../JWT/userjwt')
const upload = require('../middleware/multer')
const {
    login, // Admin Login
    home,  // Show admin data

    // Provider
    addprovider,
    showproviders,
    providerdetails,
    deleteprovider,
    updateprovider,

    // Category , Subcategory & Products
    add_btype,
    add_bcategory,
    add_bformation,
    add_product,
    add_bsubcategory,

    show_bformation,
    show_btype,
    show_products,
    show_bcategory,
    show_cat_subcat,
    subcatdata,
    updateProduct,
    
    // User
    adduser,
} = require('../controller/adminController')

router.post('/login',login)
router.get('/home', verifyToken, home)
router.get('/logout', async (req,res)=>{
    res.cookie("token","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})

// Provider
router.post('/addprovider',  upload.fields([
    {
        name : 'profile',
    },
    {
        name : 'b_brochure',
    },
    // {
    //     name :'documents',
    // }
    {
        name : 'adharcard',
    },
    {
        name : 'pancard',
    },
    {
        name : 'gstfile',
    },
    {
        name : 'tdsfile',
    },
    {
        name : 'agreementfile',
    },
]),addprovider)

router.get('/showproviders',showproviders)
router.get('/providerdetails/:id',providerdetails)
router.delete('/deleteprovider/:id',deleteprovider)
router.patch('/updateprovider/:id',upload.fields([
    {
        name : 'profile',
    },
    {
        name : 'b_brochure',
    },
    // {
    //     name :'documents',
    // }
    {
        name : 'adharcard',
    },
    {
        name : 'pancard',
    },
    {
        name : 'gstfile',
    },
    {
        name : 'tdsfile',
    },
    {
        name : 'agreementfile',
    },
]),updateprovider)

// Category , Subcategory & Products

router.post('/add_btype',add_btype)
router.post('/add_bcategory',add_bcategory)
router.post('/add_bformation',add_bformation)
router.post('/add_bsubcategory',add_bsubcategory)
router.post('/add_product',add_product)

router.get('/show_bformation',show_bformation)
router.get('/show_btype',show_btype)
router.get('/show_bcategory',show_bcategory)
router.get('/show_cat_subcat',show_cat_subcat)
router.get('/show_products',show_products)
router.post('/subcatdata',subcatdata) 


router.get('/updateproduct',updateProduct)
// User
router.post('/adduser',verifyToken,adduser)

module.exports = router