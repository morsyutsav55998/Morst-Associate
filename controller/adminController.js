const admin = require('../model/admin')
const jwt = require('jsonwebtoken');
const user = require('../model/user')
const provider = require('../model/provider');
const bcategory = require('../model/category/bussiness_category')
const btype = require('../model/category/bussiness_type')
const bsubcategory = require('../model/category/bussiness_subcategory')
const bformation = require('../model/category/bussiness_formation')
const path = require('path')
const iplink = 'http://192.168.0.113:3000/'
const fs = require('fs');

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
            name,
            email,
            number,
            BOD,
            address,
            product_service,
            // 
            Bname,
            Bnumber,
            Bemail,
            Bsocialmedia,
            B_GSTnumber,
            Bdetails,
            Btdsdetails,
            Bpancardnumber,
            Btype,
            Bformation,
            bsubcategoryid,
            Baddress,
            collaborationDetails,

            // 
            salespersonName,
            salespersonNumber,
            salespersonEmail,
            salespersonPosition,
            // 
            bankName,
            bankAccountnumber,
            bankIFSCcode,
            bankBranchname,
        } = req.body

        let profilePath = req.files['profile'] ? iplink + req.files['profile'][0].filename : iplink + '/profile.png'
        let brochurePath = req.files['b_brochure'] ? iplink + req.files['b_brochure'][0].filename : iplink + '/dummy.jpeg'
        let adharcardPath = req.files['adharcard'] ? iplink + req.files['adharcard'][0].filename : iplink + '/dummy.jpeg'
        let pancardPath = req.files['pancard'] ? iplink + req.files['pancard'][0].filename : iplink + '/dummy.jpeg'
        let gstfilePath = req.files['gstfile'] ? iplink + req.files['gstfile'][0].filename : iplink + '/dummy.jpeg'
        let tdsfilePath = req.files['tdsfile'] ? iplink + req.files['tdsfile'][0].filename : iplink + '/dummy.jpeg'
        let agreementfilePath = req.files['agreementfile'] ? iplink + req.files['agreementfile'][0].filename : iplink + '/dummy.jpeg'

        // String to array 
        const isArray = bsubcategoryid.split(',');
        // console.log(isArray);
        const catData = []
        for (var i of isArray) {
            var subcat = await bsubcategory.findById(i).populate('bcategoryid').exec()
            console.log(subcat.bcategoryid)
            catData.push(subcat)
            // console.log(subcatData,"hkasdlikasdnlkasdnlksdanlklk");
        }
        // const documentsPath = req.files['documents'].map(file => dirpath+file.filename);
        const providerData = await provider.create({
            name,
            email,
            number,
            BOD,
            address,
            profile: profilePath,
            product_service,

            // 
            Bname,
            Bnumber,
            Bemail,
            Bsocialmedia,
            B_GSTnumber,
            Btype,
            Bdetails,
            Btdsdetails,
            Bpancardnumber,
            Btype,
            Bformation,
            bsubcategoryid: subcatData,
            Baddress,
            collaborationDetails,
            b_brochure: brochurePath,

            // 
            salespersonName,
            salespersonNumber,
            salespersonEmail,
            salespersonPosition,
            // 
            bankName,
            bankAccountnumber,
            bankIFSCcode,
            bankBranchname,
            // documents : documentsPath,
            // 
            adharcard: adharcardPath,
            pancard: pancardPath,
            gstfile: gstfilePath,
            tdsfile: tdsfilePath,
            agreementfile: agreementfilePath,
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
    // .populate('bsubcategoryid').populate({
    //     path: 'bsubcategoryid',
    //     populate: {
    //         path: 'bcategoryid', // Populate the 'bcategoryid' field within 'bsubcategoryid'
    //     }
    // })
    if (data) {
        res.json({
            status: 200,
            providers: data
        })
    }
}
exports.providerdetails = async (req, res) => {
    try {
        let data = await provider.findById(req.params.id)
        // .populate('bsubcategoryid')
        //     .populate({
        //         path: 'bsubcategoryid',
        //         populate: {
        //             path: 'bcategoryid', // Populate the 'bcategoryid' field within 'bsubcategoryid'
        //         }
        //     }).exec()
        const subcatData = []
        for (var i of data.bsubcategoryid) {
            var subcat = await bsubcategory.findById(i).populate('bcategoryid').exec()
            subcatData.push(subcat)
            console.log(subcatData,"ADABJDADJADJAJNDASJKD");
        }
        res.json({
            message: "Provider all details",
            providers: data, subcatData
        })

    } catch (error) {
        console.log(error);
    }
}
// This is my delete function
exports.deleteprovider = async (req, res) => {
    try {

        // How to delete file

        const data = await provider.findById(req.params.id)
        if (data) {

            const filesToDelete = [];
            const dummyImagePath = 'http://192.168.0.113:3000//dummy.jpeg'
            const profileDummy = 'http://192.168.0.113:3000//profile.png'
            // Check and add file paths to the `filesToDelete` array
            if (data.profile && data.profile !== profileDummy) {
                filesToDelete.push(data.profile.replace(iplink, './files/'));
            }
            if (data.b_brochure && data.b_brochure !== dummyImagePath) {
                filesToDelete.push(data.b_brochure.replace(iplink, './files/'));
            }
            if (data.adharcard && data.adharcard !== dummyImagePath) {
                filesToDelete.push(data.adharcard.replace(iplink, './files/'));
            }
            if (data.pancard && data.pancard !== dummyImagePath) {
                filesToDelete.push(data.pancard.replace(iplink, './files/'));
            }
            if (data.gstfile && data.gstfile !== dummyImagePath) {
                filesToDelete.push(data.gstfile.replace(iplink, './files/'));
            }
            if (data.tdsfile && data.tdsfile !== dummyImagePath) {
                filesToDelete.push(data.tdsfile.replace(iplink, './files/'));
            }
            if (data.agreementfile && data.agreementfile !== dummyImagePath) {
                filesToDelete.push(data.agreementfile.replace(iplink, './files/'));
            }

            // Delete the files if they exist
            filesToDelete.forEach((filePath) => {
                if (filePath) {
                    fs.unlinkSync(filePath); // Synchronously delete the file
                }
            });

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

exports.updateprovider = async (req, res) => {
    try {
        const data = await provider.findById(req.params.id)
        console.log(data);
        if (data) {
            console.log(data);
            if (req.files.length == 0) {
                const provderDataupdate = await provider.findByIdAndUpdate(req.params.id, req.body)
                if (provderDataupdate) {
                    res.json({
                        status: 200,
                        message: "Provider updated successfully",
                    })
                }
                else {
                    // Update files in this module
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

exports.add_btype = async (req, res) => {
    try {

        if (req.body) {
            let data = await btype.create(req.body)
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
exports.show_bformation = async (req, res) => {
    let data = await bformation.find()
    res.json({
        message: "All bussiness formation data",
        bussinessFormation: data,
    })
}
exports.show_btype = async (req, res) => {
    const data = await btype.find()
    res.json({
        message: "All bussiness type data",
        bussinessType: data,
    })
}
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
        
        if (suboptget) {
            return res.json({
                bsubcategorys: suboptget
            })
        }
    } catch (error) {
        console.log(error);
    }
}




// User 
exports.adduser = async (req, res) => {
    try {
        if (req.body) {
            const userData = await user.create(req.body)
            if (userData) {
                res.status(200).json({
                    message: "User added successfully ",
                    registered: userData,
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}
exports.userlogin = async (req, res) => {
    try {
        const { email, number } = req.body
        const data = await user.findOne({ email })
        if (data == null) {
            res.status(400).json({
                status: 400,
                message: "Sorry! Enter Valid Email",
            });
        }
        else {
            if (data.number == number) {
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.userkey)
                res.cookie('usertoken', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                // localStorage.setItem('token', token);
                res.status(200).json({
                    status: 200,
                    message: 'User Login Successfully',
                    providertoken: token
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