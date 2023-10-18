const admin = require('../model/admin')
const jwt = require('jsonwebtoken');
const provider = require('../model/provider');
const bcategory = require('../model/services/bussiness_category')
const servicetype = require('../model/services/servicetype')
const bformation = require('../model/services/bussiness_formation')
const path = require('path')
const fs = require('fs')
// Login
exports.login = async (req, res) => {
    try {
        
        const { email, password } = req.body
        const data = await admin.findOne({ email })
        if (data == null) {
            res.status(400).json({
                status: 400,
                message: "Sorry! Enter Valid Email",
            });
        }
        else {
            if (data.password == password) {
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.key)
                res.cookie('token', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                // localStorage.setItem('token', token);
                res.status(200).json({
                    status: 200,
                    message: 'Admin Login Successfully',
                    token: token
                })
            }
            else {
                res.json({
                    status: 400,
                    message: 'Sorry! Admin Login Password Failed'
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}
exports.home = async (req, res) => {
    const adminId = req.admin
    let data = await admin.findById(adminId.id)
    if (data) {
        res.json({
            status: 200,
            admindata: data
        })
    }
}
// Provider
exports.addprovider = async (req, res) => {
    try {
        const {
            providername,
            provideremail,
            providernumber,
            providerbod,
            provideraddress,
            // 
            bussinessname,
            bussinessnumber,
            bussinessemail,
            bussinesswebsite,
            bussinessgstnumber,
            bussinesstype,
            bussinessdetails,
            bussinesstdsdetails,
            bussinesspancardnumber,
            bussinesscategory,
            bussinessaddress,
            // 
            collaborationdetails,
            // Salesmen
            salespersonname,
            salespersonnumber,
            salespersonemail,
            salespersonposition,
            // Bank
            bankname,
            bankaccountnumber,
            bankifsccode,
            bankbranchname,
        } = req.body
        const files = req.files
        var documents = []
        for (let file of files) {
            let filepath = '/files/' + file.filename
            documents.push(filepath)
        }
        const providerData = await provider.create({
            providername,
            provideremail,
            providernumber,
            providerbod,
            provideraddress,
            // 
            bussinessname,
            bussinessnumber,
            bussinessemail,
            bussinesswebsite,
            bussinessgstnumber,
            bussinesstype,
            bussinessdetails,
            bussinesstdsdetails,
            bussinesspancardnumber,
            bussinesscategory,
            bussinessaddress,
            // 
            collaborationdetails,
            // Salesmen
            salespersonname,
            salespersonnumber,
            salespersonemail,
            salespersonposition,
            // Bank
            bankname,
            bankaccountnumber,
            bankifsccode,
            bankbranchname,
            // document
            documents
        })
        if (providerData) {
            res.status(200).json({
                Status: 200,
                Message: "Provider added successfully",
                Provider: providerData
            })
        }
    } catch (error) {
        console.log(error);
    }
}
exports.showproviders = async (req, res) => {
    const data = await provider.find()
    if (data) {
        res.json({
            status: 200,
            providers: data
        })
    }
}
exports.deleteprovider = async (req, res) => {
    try {
        console.log(req.params.id);
        const data = await provider.findById(req.params.id)
        if (data) {
            const docPath = data.documents
            docPath.forEach(docpaths => {
                fs.unlinkSync(path.join(__dirname + '../../' + docpaths), () => {
                    res.json({
                        message: "Documents deleted"
                    })
                })
            })
            const dataDelete = await provider.findByIdAndDelete(req.params.id)
            if (dataDelete) {
                res.json({
                    status: 200,
                    message: "Provider deleted successfully"
                })
            }
        }
        else {
            res.json({
                message: "Data not found !"
            })
        }
    } catch (error) {
        console.log(error);
    }
}
// exports.updateprovider = async (req, res) => {
//     try {
//         const data = await provider.findById(req.params.id)
//         console.log(data);
//         if(data){
//             console.log(data);
//             if(req.files.length == 0){
//                 const provderDataupdate = await provider.findByIdAndUpdate(req.params.id,req.body)
//                 if(provderDataupdate){
//                     res.json({
//                         status : 200,
//                         message : "Provider updated successfully",
//                     })
//                 }
//                 else{
//                     data.documents.forEach(async (doc)=>{
//                         const data = 
//                     })
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

exports.add_servicetype = async (req, res) => {
    try {
        
        if (req.body) {
            let data = await servicetype.create(req.body)
            res.json({
                status: 200,
                message: "Servicetype added",
                servicetype: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}
exports.add_bcategory = async (req, res) => {
    try {
        
        if (req.body) {
            console.log(req.body);
            let data = await bcategory.create(req.body)
            res.json({
                status: 200,
                message: "Bussiness category added",
                bussinessCategory: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}
exports.add_bformation = async (req, res) => {
    try {
        
        if (req.body) {
            let data = await bformation.create(req.body)
            res.json({
                status: 200,
                message: "Bussiness Formation category added",
                bussinessformation: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}
const bsubcategory = require('../model/services/bussiness_subcategory')
exports.add_bsubcategory = async (req, res) => {
    try {
        
        if (req.body) {
            let data = await bsubcategory.create(req.body)
            res.json({
                status: 200,
                message: "Bussiness subcategory category added",
                bussinessformation: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.show_bcategory = async (req, res) => {
    try {
        let data = await bcategory.find()
        res.json({
            status: 200,
            bcategory: data,
        })
    } catch (error) {
        console.log(error);
    }
}
// exports.addbcategory = async (req, res) => {
//     try {
//         const { bussinesssubcategory, bcategoryid } = req.body
//         let bcategoryData = await bsubcategory.create({
//             bussinesssubcategory,
//             bcategoryid
//         })
//         console.log(bcategoryData);
//         if (bcategoryData) {
//             res.json({
//                 message: "Bussiness subcategory added",
//                 Bsubcategory: bcategoryData,
//             })
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }
exports.show_bsubcategory = async (req, res) => {
    try {
        let data = await bsubcategory.find().populate('bcategoryid').exec()
        res.json({
            data: data
        })
    } catch (error) {
        console.log(error);
    }
}
exports.subcatdata = async (req, res) => {
    try {
        const suboptget = await bsubcategory.find({ bcategoryid: req.body.bcatid })
        console.log(suboptget);
        if (suboptget) {
            return res.json({
                bsubcategorys: suboptget
            })
        }
    } catch (error) {
        console.log(error);
    }
}
