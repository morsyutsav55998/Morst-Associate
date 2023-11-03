const express = require('express')
const router = express.Router()
const verifyToken = require('../JWT/userjwt')
const {
    login,
    home,

    allprovider,
    search,
    show_products,
    providerdetails,
    adduserform,
    // service_details,
} = require('../controller/userController')

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

module.exports = router