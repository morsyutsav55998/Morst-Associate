const express = require('express')
const verifyToken = require('../JWT/providerjwt')
const upload = require('../middleware/multer')
const router = express.Router()
const {
    login,
    home,
    profile,
    
    orders,
    accept_order
} = require('../controller/providerController')

router.post('/login',login)
router.get('/home',verifyToken,home)
router.get('/profile',verifyToken,profile)
router.get('/orders',verifyToken,orders)
router.patch('/accept_order/:id',verifyToken,accept_order)
router.get('/logout',(req,res)=>{
    res.cookie("providertoken","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
module.exports = router