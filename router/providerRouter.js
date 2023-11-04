const express = require('express')
const verifyToken = require('../JWT/providerjwt')
const upload = require('../middleware/multer')
const router = express.Router()
const {
    login,
    home,
    profile,
    updateprovider,
    
    orders,
} = require('../controller/providerController')

router.post('/login',login)
router.get('/home',verifyToken,home)
router.get('/profile',verifyToken,profile)
router.get('/orders',verifyToken,orders)
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
router.get('/logout',(req,res)=>{
    res.cookie("providertoken","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
module.exports = router