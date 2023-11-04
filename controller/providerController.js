var provider = require("../model/provider")
var iplink = 'http://192.168.0.113:3000/'
var bsubcategory = require('../model/category/bussiness_subcategory')
var orders = require('../model/userForm')
var product = require('../model/category/product')
var user = require('../model/user')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
exports.login = async (req, res) => {
    try {
        const { email, number } = req.body
        const data = await provider.findOne({ email })
        if (data == null) {
            res.status(400).json({
                status: 400,
                message: "Sorry! Enter Valid Email",
            });
        }
        else {
            const providerNumber = await bcrypt.compare(number, data.password)
            if (providerNumber) {
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.providerkey)
                res.cookie('providertoken', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                // localStorage.setItem('token', token);
                res.status(200).json({
                    status: 200,
                    message: 'Provider Login Successfully',
                    providertoken: token
                })
            }
            else {
                res.status(400).json({
                    status: 400,
                    message: 'Sorry! Provider Login Password Failed'
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.profile = async (req, res) => {
    let data = req.provider
    const subcatData = []
    for (var i of data.bsubcategoryid) {
        var subcat = await bsubcategory.findById(i).populate('bcategoryid').exec()
        if (subcat) {
            subcatData.push(subcat)
        }
    }
    res.status(200).json({
        profile: req.provider,
        subcatData:subcatData
    })
}

exports.updateprovider = async (req, res) => {
    try {
        const providerId = req.params.id;
        const updatedData = req.body;
        const password = await bcrypt.hash(updatedData.number, 10);

        const existingProvider = await provider.findById(providerId);

        if (!existingProvider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        const fieldsToUpdate = [
            'name', 'email', 'number', 'BOD', 'address', 'Bname', 'Bnumber',
            'password', 'Bemail', 'Bsocialmedia', 'B_GSTnumber', 'Btype', 'Bdetails',
            'Btdsdetails', 'Bpancardnumber', 'Bformation', 'Baddress', 'collaborationDetails',
            'salespersonName', 'salespersonNumber', 'salespersonEmail', 'salespersonPosition',
            'bankName', 'bankAccountnumber', 'bankIFSCcode', 'bankBranchname',
        ];

        fieldsToUpdate.forEach((field) => {
            if (updatedData[field]) {
                existingProvider[field] = updatedData[field];
            }
        });

        // Process file fields
        const fileFields = ['profile', 'b_brochure', 'adharcard', 'pancard', 'gstfile', 'tdsfile', 'agreementfile'];
        fileFields.forEach((field) => {
            if (req.files[field]) {
                const newFilePath = iplink + req.files[field][0].filename;
                if (existingProvider[field] && existingProvider[field] !== iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg')) {
                    const oldFilePath = existingProvider[field].replace(iplink, './files/');
                    fs.unlinkSync(oldFilePath);
                }
                existingProvider[field] = newFilePath;
            } else {
                if (existingProvider[field] && existingProvider[field] !== iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg')) {
                    const oldFilePath = path.join('./files', existingProvider[field].replace(iplink, ''));
                    fs.unlinkSync(oldFilePath);
                }
                existingProvider[field] = iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg');
            }
        });

        // Process 'product_service'
        if (updatedData.productService) {
            const productArray = [...new Set(updatedData.productService.split(',').map(item => item.trim()))].sort();
            existingProvider.product_service = productArray;
        }

        // Process 'bsubcategoryid'
        if (updatedData.sbcatid) {
            const subcatArray = updatedData.sbcatid.split(',');
            existingProvider.bsubcategoryid = subcatArray;
        }

        // Save the updated provider
        const updatedProvider = await existingProvider.save();

        res.status(200).json({
            message: "Provider updated successfully",
            provider: updatedProvider,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Internal server error",
        });
    }
};

exports.home = async (req, res) => {
    try {
        const providerId = req.provider
        let data = await provider.findById(providerId.id)
        if (data) {
            res.json({
                status: 200,
                providerdata: data
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.orders = async (req, res) => {
    try {
        const managerId = req.provider
        let data = await provider.findById(managerId.id)
        const orderIds = data.orderids;
        const orderData = [];
        for (const orderId of orderIds) {
            const order = await orders.findById(orderId).populate({
                path: 'productid',
                model: product,
                populate: {
                    path: 'bsubcategoryid',
                    populate: {
                        path: 'bcategoryid'
                    }
                }
            }).populate({
                path: 'userid',
                model: user,
            }).exec();
            if (order) {
                orderData.push(order);
            } else {
                orderData.push({ error: `Order with ID ${orderId} not found` });
            }
        }
        res.json({
            message: "👍",
            providerorder: orderData
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Internal server error"
        })
    }
}