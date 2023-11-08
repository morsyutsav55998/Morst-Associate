const express = require('express')
const router = express.Router()
const verifyToken = require('../JWT/memberjwt')
const {
    login,
    home,

    allprovider,
    search,
    show_products,
    providerdetails,
    adduserform,
    
    show_order,
    order_detail,
    completed_order,
} = require('../controller/memberController')

router.post('/login',login)
router.get('/logout', async (req,res)=>{
    res.cookie("usertoken","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
router.get('/home',verifyToken,home)
router.get('/allprovider',verifyToken,allprovider)
router.post('/search',verifyToken,search)
router.get('/providerdetails/:id',providerdetails)
router.post('/userform',verifyToken,adduserform)
router.get('/show_products',verifyToken,show_products)

router.get('/show_order',verifyToken,show_order)
router.get('/order_detail/:id',verifyToken,order_detail)
router.get('/completed_order',verifyToken,completed_order)

module.exports = router