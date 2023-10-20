const admin = require('../model/admin')
const jwt = require('jsonwebtoken');
const provider = require('../model/provider');
const bcategory = require('../model/category/bussiness_category')
const btype = require('../model/category/bussiness_type')
const bsubcategory = require('../model/category/bussiness_subcategory')
const bformation = require('../model/category/bussiness_formation')
const path = require('path')
const iplink = 'http://192.168.0.113:3000/'
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
// exports.addprovider = async (req, res) => {
//     try {
//         // console.log(req.body);
//         // console.log(req.files);
//         const {
//             name,
//             email,
//             number,
//             BOD,
//             address,
//             // 
//             Bname,
//             Bnumber,
//             Bemail,
//             Bsocialmedia,
//             B_GSTnumber,
//             Bdetails,
//             Btdsdetails,
//             Bpancardnumber,
//             Btype,
//             Bformation,
//             bsubcategoryid,
//             Baddress,
//             collaborationDetails,
//             // 
//             salespersonName,
//             salespersonNumber,
//             salespersonEmail,
//             salespersonPosition,
//             // 
//             bankName,
//             bankAccountnumber,
//             bankIFSCcode,
//             bankBranchname,
//         } = req.body
//         // Files upload 
//         var profilePath = req.files.profile;
//         console.log(profilePath, "oooooooooooooooo");
//         var brochurePath = iplink + req.files.b_brochure;
//         var adharcardPath = iplink + req.files.adharcard;
//         var pancardPath = iplink + req.files.pancard;
//         var gstfilePath = iplink + req.files.gstfile;
//         var tdsfilePath = iplink + req.files.tdsfile;
//         var agreementfilePath = iplink + req.files.agreementfile;

//         profilePath = profilePath.replace(iplink, "");

//         console.log(profilePath);
//         if (profilePath == undefined) {
//             profilePath = iplink + '1697792093045-716279775-tds.png'; // Replace with the desired value for profilePath
//         } else {
//             profilePath = iplink + req.files.profile[0].filename
//             console.log(profilePath, "88");
//             ; // Corrected variable assignment
//         }

//         brochurePath = brochurePath.replace(iplink, "");
//         if (brochurePath == undefined) {
//             brochurePath = iplink + '1697792093045-716279775-tds.png';
//         } else {
//             brochurePath = iplink + req.files.profile[0].filename // Corrected variable assignment
//         }

//         adharcardPath = adharcardPath.replace(iplink, "");
//         if (adharcardPath == undefined) {
//             adharcardPath = iplink + '1697792093045-716279775-tds.png';
//         } else {
//             adharcardPath = iplink + req.files.profile[0].filename // Corrected variable assignment
//         }

//         pancardPath = pancardPath.replace(iplink, "");
//         if (pancardPath == undefined) {
//             pancardPath = iplink + '1697792093045-716279775-tds.png';
//         } else {
//             pancardPath = iplink + req.files.profile[0].filename // Corrected variable assignment
//         }

//         gstfilePath = gstfilePath.replace(iplink, "");
//         if (gstfilePath == undefined) {
//             gstfilePath = iplink + '1697792093045-716279775-tds.png';
//         } else {
//             gstfilePath = iplink + req.files.profile[0].filename // Corrected variable assignment
//         }

//         tdsfilePath = tdsfilePath.replace(iplink, "");
//         if (tdsfilePath == undefined) {
//             tdsfilePath = iplink + '1697792093045-716279775-tds.png';
//         } else {
//             tdsfilePath = iplink + req.files.profile[0].filename // Corrected variable assignment
//         }

//         agreementfilePath = agreementfilePath.replace(iplink, "");
//         if (agreementfilePath == undefined) {
//             agreementfilePath = iplink + '1697792093045-716279775-tds.png';
//         } else {
//             agreementfilePath = iplink + req.files.profile[0].filename // Corrected variable assignment
//         }

//         // Now you have conditionally set paths for each variable

//         // const documentsPath = req.files['documents'].map(file => dirpath+file.filename);

//         const providerData = await provider.create({
//             name,
//             email,
//             number,
//             BOD,
//             address,
//             profile: profilePath,
//             Bname,
//             Bnumber,
//             Bemail,
//             Bsocialmedia,
//             B_GSTnumber,
//             Btype,
//             Bdetails,
//             Btdsdetails,
//             Bpancardnumber,
//             Btype,
//             Bformation,
//             bsubcategoryid,
//             Baddress,
//             collaborationDetails,
//             b_brochure: brochurePath,
//             // 
//             salespersonName,
//             salespersonNumber,
//             salespersonEmail,
//             salespersonPosition,

//             // 
//             bankName,
//             bankAccountnumber,
//             bankIFSCcode,
//             bankBranchname,
//             // documents : documentsPath,
//             // 
//             adharcard: adharcardPath,
//             pancard: pancardPath,
//             gstfile: gstfilePath,
//             tdsfile: tdsfilePath,
//             agreementfile: agreementfilePath,
//         })
//         console.log(providerData);
//         if (providerData) {
//             res.status(200).json({
//                 Status: 200,
//                 Message: "Provider added successfully",
//                 Provider: providerData
//             })
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }
exports.addprovider = async (req, res) => {
    try {
        const {
            name,
            email,
            number,
            BOD,
            address,

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
        let brochurePath = req.files['b_brochure'] ? iplink + req.files['b_brochure'][0].filename : iplink + '/dummy.jpeg';
        let adharcardPath = req.files['adharcard'] ? iplink + req.files['adharcard'][0].filename : iplink + '/dummy.jpeg';
        let pancardPath = req.files['pancard'] ? iplink + req.files['pancard'][0].filename : iplink + '/dummy.jpeg';
        let gstfilePath = req.files['gstfile'] ? iplink + req.files['gstfile'][0].filename : iplink + '/dummy.jpeg';
        let tdsfilePath = req.files['tdsfile'] ? iplink + req.files['tdsfile'][0].filename : iplink + '/dummy.jpeg';
        let agreementfilePath = req.files['agreementfile'] ? iplink + req.files['agreementfile'][0].filename : iplink + '/dummy.jpeg';

        // const documentsPath = req.files['documents'].map(file => dirpath+file.filename);
        const providerData = await provider.create({
            name,
            email,
            number,
            BOD,
            address,
            profile: profilePath,

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
            bsubcategoryid,
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
            // documents : documentsPath,'
            // 
            adharcard: adharcardPath,
            pancard: pancardPath,
            gstfile: gstfilePath,
            tdsfile: tdsfilePath,
            agreementfile: agreementfilePath,
        })
        console.log(providerData);
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
    const data = await provider.find().populate('bsubcategoryid').populate({
        path: 'bsubcategoryid',
        populate: {
            path: 'bcategoryid', // Populate the 'bcategoryid' field within 'bsubcategoryid'
        }
    })
    if (data) {
        res.json({
            status: 200,
            providers: data
        })
    }
}
exports.providerdetails = async (req, res) => {
    try {
        let data = await provider.findById(req.params.id).populate('bsubcategoryid').populate({
            path: 'bsubcategoryid',
            populate: {
                path: 'bcategoryid', // Populate the 'bcategoryid' field within 'bsubcategoryid'
            }
        })
        res.json({
            message: "Provider all details",
            providers: data
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

            var profilePath = data.profile.replace(iplink,'./files/');
            var brochurePath = data.b_brochure.replace(iplink,'./files/');
            var adharcardPath = data.adharcard.replace(iplink,'./files/');
            var pancardPath = data.pancard.replace(iplink, './files/');
            var gstfilePath = data.gstfile.replace(iplink, './files/');
            var tdsfilePath = data.tdsfile.replace(iplink, './files/');
            var agreementfilePath = data.agreementfile.replace(iplink, './files/');

            // Delete files from the server
            fs.unlinkSync(profilePath);     
            fs.unlinkSync(brochurePath);
            fs.unlinkSync(adharcardPath);
            fs.unlinkSync(pancardPath);
            fs.unlinkSync(gstfilePath);
            fs.unlinkSync(tdsfilePath);
            fs.unlinkSync(agreementfilePath);

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
                    // data.documents.forEach(async (doc)=>{
                    //     const data = 
                    // })
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
