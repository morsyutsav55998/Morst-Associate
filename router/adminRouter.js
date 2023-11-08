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
    
    // Manager
    addmanager,
    delete_manager,
    update_manager,
    allmanager,
    manager_detail,
    
    // User
    adduser,
    userdetails,
    deleteuser,
    updateuser,
    alluser,
    userform_details,

    // Order
    all_userform,
    today_order,
    forward_order,
    done_order,
    order_detail,
    comission_total,
    user_order
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
        maxCount: 1,
    },
    {
        name : 'b_brochure',
        maxCount: 1,
    },
    {
        name : 'adharcard',
        maxCount: 1,
    },
    {
        name : 'pancard',
        maxCount: 1,
    },
    {
        name : 'gstfile',
        maxCount: 1,
    },
    {
        name : 'tdsfile',
        maxCount: 1,
    },
    {
        name : 'agreementfile',
        maxCount: 1,
    },
]),addprovider)

router.get('/showproviders',verifyToken,showproviders)
router.get('/providerdetails/:id',verifyToken,providerdetails)
router.delete('/deleteprovider/:id',verifyToken,deleteprovider)
router.patch('/updateprovider/:id',verifyToken,upload.fields([
    {
        name : 'profile',
        maxCount: 1,
    },
    {
        name : 'b_brochure',
        maxCount: 1,
    },  
    {
        name : 'adharcard',
        maxCount: 1,
    },
    {
        name : 'pancard',
        maxCount: 1,
    },
    {
        name : 'gstfile',
        maxCount: 1,
    },
    {
        name : 'tdsfile',
        maxCount: 1,
    },
    {
        name : 'agreementfile',
        maxCount: 1,
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

// Manager
router.post('/addmanager',verifyToken,addmanager)
router.delete('/delete_manager/:id',verifyToken,delete_manager)
router.get('/allmanager',verifyToken,allmanager)
router.get('/manager_detail/:id',verifyToken,manager_detail)
router.patch('/update_manager/:id',verifyToken,update_manager)

// User
router.post('/productid',verifyToken,productid)
router.post('/adduser',verifyToken,adduser)
router.get('/userdetails/:id',verifyToken,userdetails)
router.delete('/deleteuser/:id',verifyToken,deleteuser)
router.patch('/updateuser/:id',verifyToken,updateuser)
router.get('/alluser',verifyToken,alluser)
router.get('/userform_details/:id',verifyToken,userform_details)    

// Order
router.get('/all_userform',verifyToken,all_userform)
router.get('/today_order',verifyToken,today_order)
router.post('/forward_order',verifyToken,forward_order)
router.get('/done_order',verifyToken,done_order)
router.get('/order_detail/:id',verifyToken,order_detail)
router.get('/comission_total',verifyToken,comission_total)

router.get('/user_order/:id',verifyToken,user_order)
module.exports = router