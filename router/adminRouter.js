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
    productid,
    show_bcategory,
    show_cat_subcat,
    subcatdata,
    showproduct,
    
    // User
    adduser,
    alluser,
    all_userform,
    userform_details,
} = require('../controller/adminController')

router.post('/login',login)
router.get('/home', verifyToken, home)
router.get('/logout', async (req,res)=>{
    res.cookie("token","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
// Provider
router.post('/addprovider',verifyToken,upload.fields([
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

router.get('/showproviders',verifyToken,showproviders)
router.get('/providerdetails/:id',verifyToken,providerdetails)
router.delete('/deleteprovider/:id',verifyToken,deleteprovider)
router.patch('/updateprovider/:id',verifyToken,upload.fields([
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

router.post('/add_btype',verifyToken,add_btype)
router.post('/add_bcategory',verifyToken,add_bcategory)
router.post('/add_bformation',verifyToken,add_bformation)
router.post('/add_bsubcategory',verifyToken,add_bsubcategory)
router.post('/add_product',verifyToken,add_product)

router.get('/show_bformation',verifyToken,show_bformation)
router.get('/show_btype',verifyToken,show_btype)
router.get('/show_bcategory',verifyToken,show_bcategory)
router.get('/show_cat_subcat',verifyToken,show_cat_subcat)
router.get('/show_products',verifyToken,show_products)
router.post('/subcatdata',verifyToken,subcatdata) 

router.post('/showproduct',verifyToken,showproduct)
// User
router.post('/productid',verifyToken,productid)
router.post('/adduser',verifyToken,adduser)
router.get('/alluser',verifyToken,alluser)
router.get('/all_userform',verifyToken,all_userform)
router.get('/userform_details/:id',verifyToken,userform_details)


module.exports = router