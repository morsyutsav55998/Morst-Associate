const express = require('express')
const verifyToken = require('../JWT/providerjwt')
const upload = require('../middleware/multer')
const router = express.Router()
const {
    login,
    home,

    addservice,
    showservices,
} = require('../controller/providerController')

router.post('/login',login)
router.get('/home',verifyToken,home)
router.get('/logout', async (req,res)=>{
    res.cookie("token","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
router.post('/addservice',verifyToken,upload.array('serviceimg'),addservice)
router.get('/showservices',verifyToken,showservices) 
module.exports = router