const admin = require('../model/admin')
const jwt = require('jsonwebtoken');
const user = require('../model/user')
const provider = require('../model/provider');
const bcategory = require('../model/category/bussiness_category')
const btype = require('../model/category/bussiness_type')
const userform = require('../model/userForm')
const bsubcategory = require('../model/category/bussiness_subcategory')
const product = require('../model/category/product')
const bformation = require('../model/category/bussiness_formation')
const bcrypt = require('bcrypt')
const path = require('path')
const iplink = 'http://192.168.0.113:3000/'
var fs = require('fs');
const { log } = require('console');

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
                res.status(400).json({
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

        var {
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
        const password = await bcrypt.hash(number, 10)

        // Split the string into an array based on commas and remove leading/trailing spaces
        const originalArray = product_service.split(',').map(item => item.trim());

        // Create a Set to remove duplicates and spread it into a new array
        const uniqueArray = [...new Set(originalArray)];

        // Sort the unique array alphabetically
        uniqueArray.sort();

        let profilePath = req.files['profile'] ? iplink + req.files['profile'][0].filename : iplink + '/profile.png'  // If user not upload profile that place iplink + '/profile.png'  that address set 
        // If user not upload any other files that place iplink + '/dummy.jpeg'  that address set 
        let brochurePath = req.files['b_brochure'] ? iplink + req.files['b_brochure'][0].filename : iplink + '/dummy.jpeg'
        let adharcardPath = req.files['adharcard'] ? iplink + req.files['adharcard'][0].filename : iplink + '/dummy.jpeg'
        let pancardPath = req.files['pancard'] ? iplink + req.files['pancard'][0].filename : iplink + '/dummy.jpeg'
        let gstfilePath = req.files['gstfile'] ? iplink + req.files['gstfile'][0].filename : iplink + '/dummy.jpeg'
        let tdsfilePath = req.files['tdsfile'] ? iplink + req.files['tdsfile'][0].filename : iplink + '/dummy.jpeg'
        let agreementfilePath = req.files['agreementfile'] ? iplink + req.files['agreementfile'][0].filename : iplink + '/dummy.jpeg'

        // String to array 
        const isArray = bsubcategoryid.split(',');
        const providerData = await provider.create({
            name,
            email,
            number,
            password,
            BOD,
            address,
            profile: profilePath,
            product_service: uniqueArray,
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
            bsubcategoryid: isArray,
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
        const subcatData = []
        for (var i of data.bsubcategoryid) {
            var subcat = await bsubcategory.findById(i).populate('bcategoryid').exec()
            subcatData.push(subcat)
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
        console.log(error)
    }
}


exports.updateprovider = async (req, res) => {
    try {
        const providerId = req.params.id;
        const updatedData = req.body;
        console.log(updatedData);
        const existingProvider = await provider.findById(providerId);

        if (!existingProvider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        // Profile
        if (req.files['profile']) {
            const newProfilePath = iplink + req.files['profile'][0].filename;

            if (existingProvider.profile && existingProvider.profile !== iplink + '/profile.png') {
                const oldProfilePath = existingProvider.profile.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.profile = newProfilePath;
        }
        else {
            if (existingProvider.profile && existingProvider.profile !== iplink + '/profile.png') {
                const oldProfilePath = path.join('./files', existingProvider.profile.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.profile = iplink + '/profile.png';
        }
        // b_brochure
        if (req.files['b_brochure']) {
            const newProfilePath = iplink + req.files['b_brochure'][0].filename;

            if (existingProvider.b_brochure && existingProvider.b_brochure !== iplink + '/dummy.jpeg') {
                const oldProfilePath = existingProvider.b_brochure.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.b_brochure = newProfilePath;
        }
        else {
            if (existingProvider.b_brochure && existingProvider.b_brochure !== iplink + '/dummy.jpeg') {
                const oldProfilePath = path.join('./files', existingProvider.b_brochure.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.b_brochure = iplink + '/dummy.jpeg';
        }
        //adharcard
        if (req.files['adharcard']) {
            const newProfilePath = iplink + req.files['adharcard'][0].filename;

            if (existingProvider.adharcard && existingProvider.adharcard !== iplink + '/dummy.jpeg') {
                const oldProfilePath = existingProvider.adharcard.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.adharcard = newProfilePath;
        }
        else {
            if (existingProvider.adharcard && existingProvider.adharcard !== iplink + '/dummy.jpeg') {
                const oldProfilePath = path.join('./files', existingProvider.adharcard.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.adharcard = iplink + '/dummy.jpeg';
        }
        //pancard
        if (req.files['pancard']) {
            const newProfilePath = iplink + req.files['pancard'][0].filename;

            if (existingProvider.pancard && existingProvider.pancard !== iplink + '/dummy.jpeg') {
                const oldProfilePath = existingProvider.pancard.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.pancard = newProfilePath;
        }
        else {
            if (existingProvider.pancard && existingProvider.pancard !== iplink + '/dummy.jpeg') {
                const oldProfilePath = path.join('./files', existingProvider.pancard.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.pancard = iplink + '/dummy.jpeg';
        }
        //gstfile
        if (req.files['gstfile']) {
            const newProfilePath = iplink + req.files['gstfile'][0].filename;

            if (existingProvider.gstfile && existingProvider.gstfile !== iplink + '/dummy.jpeg') {
                const oldProfilePath = existingProvider.gstfile.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.gstfile = newProfilePath;
        }
        else {
            if (existingProvider.gstfile && existingProvider.gstfile !== iplink + '/dummy.jpeg') {
                const oldProfilePath = path.join('./files', existingProvider.gstfile.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.gstfile = iplink + '/dummy.jpeg';
        }
        //tdsfile
        if (req.files['tdsfile']) {
            const newProfilePath = iplink + req.files['tdsfile'][0].filename;

            if (existingProvider.tdsfile && existingProvider.tdsfile !== iplink + '/dummy.jpeg') {
                const oldProfilePath = existingProvider.tdsfile.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.tdsfile = newProfilePath;
        }
        else {
            if (existingProvider.tdsfile && existingProvider.tdsfile !== iplink + '/dummy.jpeg') {
                const oldProfilePath = path.join('./files', existingProvider.tdsfile.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.tdsfile = iplink + '/dummy.jpeg';
        }
        //agreementfile
        if (req.files['agreementfile']) {
            const newProfilePath = iplink + req.files['agreementfile'][0].filename;

            if (existingProvider.tdsfile && existingProvider.agreementfile !== iplink + '/dummy.jpeg') {
                const oldProfilePath = existingProvider.agreementfile.replace(iplink, './files/');
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.agreementfile = newProfilePath;
        }
        else {
            if (existingProvider.agreementfile && existingProvider.agreementfile !== iplink + '/dummy.jpeg') {
                const oldProfilePath = path.join('./files', existingProvider.agreementfile.replace(iplink, ''));
                fs.unlinkSync(oldProfilePath);
            }
            updatedData.agreementfile = iplink + '/dummy.jpeg';
        }

        existingProvider.profile = updatedData.profile
        existingProvider.b_brochure = updatedData.b_brochure
        existingProvider.adharcard = updatedData.adharcard
        existingProvider.pancard = updatedData.pancard
        existingProvider.gstfile = updatedData.gstfile
        existingProvider.tdsfile = updatedData.tdsfile
        existingProvider.agreementfile = updatedData.agreementfile
        // 
        const password = await bcrypt.hash(updatedData.number, 10)
        const product_service_ = updatedData.product_service
        const originalArray = product_service_.split(',').map(item => item.trim());
        // Create a Set to remove duplicates and spread it into a new array
        const uniqueArray = [...new Set(originalArray)];
        // Sort the unique array alphabetically
        uniqueArray.sort();
        existingProvider.name = updatedData.name;
        existingProvider.email = updatedData.email;
        existingProvider.number = updatedData.number;
        existingProvider.BOD = updatedData.BOD;
        existingProvider.address = updatedData.address;
        existingProvider.product_service = uniqueArray
        existingProvider.Bname = updatedData.Bname;
        existingProvider.Bnumber = updatedData.Bnumber;
        existingProvider.password = password;
        existingProvider.Bemail = updatedData.Bemail;
        existingProvider.Bsocialmedia = updatedData.Bsocialmedia;
        existingProvider.B_GSTnumber = updatedData.B_GSTnumber;
        existingProvider.Btype = updatedData.Btype;
        existingProvider.Bdetails = updatedData.Bdetails;
        existingProvider.Btdsdetails = updatedData.Btdsdetails;
        existingProvider.Bpancardnumber = updatedData.Bpancardnumber;
        existingProvider.Bformation = updatedData.Bformation;
        existingProvider.bsubcategoryid = updatedData.bsubcategoryid;
        existingProvider.Baddress = updatedData.Baddress;
        existingProvider.collaborationDetails = updatedData.collaborationDetails;
        existingProvider.salespersonName = updatedData.salespersonName;
        existingProvider.salespersonNumber = updatedData.salespersonNumber;
        existingProvider.salespersonEmail = updatedData.salespersonEmail;
        existingProvider.salespersonPosition = updatedData.salespersonPosition;
        existingProvider.bankName = updatedData.bankName;
        existingProvider.bankAccountnumber = updatedData.bankAccountnumber;
        existingProvider.bankIFSCcode = updatedData.bankIFSCcode;
        existingProvider.bankBranchname = updatedData.bankBranchname;

        // Update other fields as needed...
        const updatedProvider = await existingProvider.save()
        res.status(200).json({
            message: "Provider updated successfully",
            provider: updatedProvider
        });
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
exports.add_product = async (req, res) => {
    try {
        let data = await product.create(req.body)
        res.json({
            message: "Product added",
            "product & service": data
        })
    } catch (error) {
        console.log(error);
    }
}


exports.show_products = async (req, res) => {
    try {
        let data = await product.find().populate({
            path: 'bsubcategoryid',
            populate: {
                path: 'bcategoryid bussinesssubcategory',
            },
        });
        res.json({
            message: "Show data",
            "product & service": data,
        })
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
        res.status(200).json({
            bcategory: data,
        })
    } catch (error) {
        console.log(error);
    }
}
exports.show_cat_subcat = async (req, res) => {
    try {
        let data = await bsubcategory.find().populate('bcategoryid').exec()
        res.json({
            bsubcategory: data
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
    console.log(req.body);
    var data = await user.find({})
    data = data.slice(-1)
    var ids = 0
    if (data[0] == undefined || data.length == 0) {
        ids = 1;
    } else {
        ids = data[0].ids + 1
    }
    console.log(data.slice(-1));
    try {
        const {
            name,
            email,
            number,
            DOB,
            occupation,
            reference,
            ref_no,
            address
        } = req.body
        let data = await user.findOne({ email: req.body.email })
        if (data) {
            res.json({
                message: "Account Already Registered",
            })
        }
        else {
            const password = await bcrypt.hash(number, 10)
            const userData = await user.create({
                name,
                email,
                number,
                password,
                DOB,
                occupation,
                reference,
                ref_no,
                address,
                ids
            })
            if (userData) {
                res.status(200).json({
                    message: "User added successfully",
                    registered: userData,
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}
exports.alluser = async (req, res) => {
    try {
        let data = await user.find()
        res.status(200).json({
            message: "All Users",
            users: data
        })
    } catch (error) {
        console.log(error);
    }
}
exports.all_userform = async (req, res) => {
    try {
        const userForms = await userform.find().populate({
            path: 'productid',
            model: product,
            populate: {
                path: 'bsubcategoryid',
                populate: {
                    path: 'bcategoryid'
                } // Assuming these are the fields in the product model
            }
        })
            .populate({
                path: 'userid',
                model: user, // Replace with your actual User model name
            })
            .exec();
        res.status(200).json({
            message: "All userforms",
            userForms,
        })
    } catch (error) {
        console.log(error);
    }
}
exports.userform_details = async (req, res) => {
    try {
        console.log(req.params.id);
        let data = await userform.findById(req.params.id).populate({
            path: 'productid',
            model: product,
            populate: {
                path: 'bsubcategoryid',
                populate: {
                    path: 'bcategoryid'
                }
            }
        })
            .populate({
                path: 'userid',
                model: user,
            })
            .exec();

        res.json({
            data
        })

    } catch (error) {
        console.log(error);
    }
}
exports.showproduct = async (req, res) => {
    try {
        let data = req.body
        console.log(req.body);
        const products = await product.find({
            'bsubcategoryid': { $in: data },
        });
        const productValues = products.map(product => product.product);

        // Send the product values in the response
        res.json({ productService: productValues });

    } catch (error) {
        console.log(error);
    }
}
exports.productid = async (req, res) => {
    try {
        let data = req.body
        let id = data[0]
        const products = await product.find({
            'bsubcategoryid': { $in: id },
        });
        // const productValues = products.map(product => product.product);
        // Send the product values in the response
        res.json({ productService: products });

    } catch (error) {
        console.log(error);
    }
}