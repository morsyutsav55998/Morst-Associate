const admin = require('../model/admin')
const jwt = require('jsonwebtoken');
const provider = require('../model/provider');
const service = require('../model/service')
const path = require('path')
const fs = require('fs')
// Login
exports.login = async (req, res) => {
    try {
        console.log(req.body);
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
        console.log(req.body);
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

// Service

exports.addservice = async (req, res) => {
    try {
        let serviceData = await service.create(req.body)
        if (serviceData) {
            res.json({
                status: 200,
                message: "Service added successfully"
            })
        }
    } catch (error) {
        console.log(error);
    }
}
exports.showservices = async (req, res) => {
    let serviceData = await service.find()
    if (serviceData) {
        res.json({
            message: "All services",
            services: serviceData
        })
    }
}
exports.deleteservice = async (req, res) => {
    try {
        let deleteData = await service.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log(error);
    }

}