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
router.post('/forgot_number',forgot_number)
// 
router.get('/home',verifyToken,home)
router.get('/showorders',verifyToken,showorders)

module.exports = router