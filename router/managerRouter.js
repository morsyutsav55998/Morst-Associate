var express = require('express')
var router = express.Router()
var verifyToken = require('../JWT/managerjwt')

var {
    login,
    home,
    checkemail,
    verify_otp,
    forgot_number,
    
    showorders,
    allprovider,
    orderdetail,
    provider_order
} = require('../controller/managerController')

router.post('/login',login)
router.get('/logout',(req,res)=>{
    res.cookie("managertoken","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
// Forget Password
router.post('/checkemail',checkemail)
router.post('/verify_otp',verify_otp)
router.post('/forget_number',forgot_number)

// 
router.get('/home',verifyToken,home)
router.get('/showorders',verifyToken,showorders)
router.post('/allprovider',verifyToken,allprovider)
router.get('/orderdetail/:id',verifyToken,orderdetail)
router.post('/provider_order',verifyToken,provider_order)

module.exports = router