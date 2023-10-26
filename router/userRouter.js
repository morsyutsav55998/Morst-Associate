const express = require('express')
const router = express.Router()
const verifyToken = require('../JWT/userjwt')
const {
    login,
    
    allprovider,
    search,
    providerdetails,
    // service_details,
} = require('../controller/userController')

router.post('/login',login)
router.get('/logout', async (req,res)=>{
    res.cookie("token","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})

router.get('/allprovider',verifyToken,allprovider)
router.post('/search',search)
router.get('/providerdetails/:id',providerdetails)


module.exports = router