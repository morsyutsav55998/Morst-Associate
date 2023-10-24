const user = require('../model/user')
const provider = require('../model/provider')
const services = require('../model/provider_service')
const bsubcategory = require('../model/category/bussiness_subcategory')
const jwt = require('jsonwebtoken')


// exports.register = async (req,res)=>{
//     try {
//         if(req.body){
//             // let data = {
//             //     name,
//             //     email,
//             //     number,
//             //     DOB,
//             //     occupation,
//             //     reference,
//             // } = req.body
//             console.log(req.body);
//             const userData = await user.create(req.body)
//             if(userData){
//                 res.status(200).json({
//                     message : "User is registred successfully ",
//                     registered :  userData,
//                 })
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

exports.login = async (req,res)=>{
    try {
        console.log(req.body);
        const { email, number } = req.body
        const data = await user.findOne({ email })
        if (data == null) {
            res.status(400).json({
                status: 400,
                message: "Sorry! Enter Valid Email",
            });
        }
        else {
            if (data.number == number){
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.userkey)
                res.cookie('usertoken', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                res.status(200).json({
                    status: 200,
                    message: 'User Login Successfully',
                    usertoken: token
                })
            }
            else {
                res.json({
                    status: 400,
                    message: 'Sorry! User Login Password Failed'
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}
exports.allprovider = async (req,res)=>{
    try {
        const servicesData = await provider.find()
        res.status(200).json({
            message: "All provider",
            services : servicesData,
        })
    } catch (error) {
        console.log(error);
    }
}
exports.search = async (req,res)=>{
    try {
        const data = await provider.find()
        const searchTerm = req.body.search.toLowerCase(); 
        // How to search 
        
        res.json(filteredData);

    } catch (error) {
        console.log(error);
    }
}