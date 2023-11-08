var admin = require('../model/admin')
var jwt = require('jsonwebtoken');
var user = require('../model/user')
var provider = require('../model/provider');
var bcategory = require('../model/category/bussiness_category')
var btype = require('../model/category/bussiness_type')
var userform = require('../model/order')
var bsubcategory = require('../model/category/bussiness_subcategory')
var product = require('../model/category/product')
var bformation = require('../model/category/bussiness_formation')
var bcrypt = require('bcrypt')
var path = require('path')
var iplink = 'http://192.168.0.113:3000/'
var fs = require('fs');
var manager = require('../model/manager');
function emptyobj(obj) {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            return true; // Found an empty, undefined, or null field
        }
    }
    return false; // No empty, undefined, or null fields found
}
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
        res.status(400).json({
            message: "Internal server error"
        })
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
            collaborationCompany,
            collaborationMember,
            salespersonName,
            salespersonNumber,
            salespersonEmail,
            salespersonPosition,
            bankName,
            bankAccountnumber,
            bankIFSCcode,
            bankBranchname,
            upiid
        } = req.body;

        const password = await bcrypt.hash(number, 10);
        const processFile = (fieldName, defaultValue) => (req.files[fieldName] ? iplink + req.files[fieldName][0].filename : defaultValue);
        const processArrayField = (fieldName) => [...new Set(req.body[fieldName].split(',').map(item => item.trim()))].sort();

        const fileFields = ['profile', 'b_brochure', 'adharcard', 'pancard', 'gstfile', 'tdsfile', 'agreementfile'];
        const fileFieldPaths = fileFields.reduce((paths, field) => {
            paths[field] = processFile(field, iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg'));
            return paths;
        }, {});
        const isArray = bsubcategoryid.split(',');

        const providerData = await provider.create({
            name, email, number, password, BOD, address, profile: fileFieldPaths.profile,
            product_service: processArrayField('product_service'),
            Bname, Bnumber, Bemail, Bsocialmedia, B_GSTnumber, Btype, Bdetails, Btdsdetails, Bpancardnumber,
            Btype, Bformation, bsubcategoryid: isArray, Baddress, collaborationCompany, collaborationMember,
            b_brochure: fileFieldPaths.b_brochure,
            salespersonName, salespersonNumber, salespersonEmail, salespersonPosition,
            bankName, upiid, bankAccountnumber, bankIFSCcode, bankBranchname,
            adharcard: fileFieldPaths.adharcard, pancard: fileFieldPaths.pancard,
            gstfile: fileFieldPaths.gstfile, tdsfile: fileFieldPaths.tdsfile,
            agreementfile: fileFieldPaths.agreementfile,
        });

        return res.status(200).json({
            Status: 200,
            Message: "Provider added successfully",
            Provider: providerData
        });
    } catch (error) {
        return res.status(400).json({ message: "Internal server error" });
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
// exports.providerdetails = async (req, res) => {
//     try {
//         let data = await provider.findById(req.params.id)
//         if (data) {
//             const subcatData = []
//             for (var i of data.bsubcategoryid) {
//                 var subcat = await bsubcategory.findById(i).populate('bcategoryid').exec()
//                 if (subcat) {
//                     subcatData.push(subcat)
//                 }
//             }
//             res.json({
//                 message: "Provider all details",
//                 providers: data, subcatData
//             })
//         }
//         else {
//             res.status(400).json({
//                 message: "Provider not found !"
//             })
//         }

//     } catch (error) {
//         res.json({ message: "internal server error" })
//     }
// }
exports.providerdetails = async (req, res) => {
    try {
        let data = await provider.findById(req.params.id)
        if (data) {
            const subcatData = []
            for (var i of data.bsubcategoryid) {
                var subcat = await bsubcategory.findById(i).populate('bcategoryid').exec()
                if (subcat) {
                    subcatData.push(subcat)
                }
            }
            res.json({
                message: "Provider all details",
                providers: data, subcatData
            })
        }
        else {
            res.status(400).json({
                message: "Provider not found !"
            })
        }

    } catch (error) {
        res.json({ message: "internal server error" })
    }
}
// This is my delete function
exports.deleteprovider = async (req, res) => {
    try {
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
        res.json({ message: "internal server error" })
    }
}
// exports.updateprovider = async (req, res) => {
//     try {
//         const providerId = req.params.id;
//         const updatedData = req.body;
//         const password = await bcrypt.hash(updatedData.number, 10);

//         const existingProvider = await provider.findById(providerId);

//         if (!existingProvider) {
//             return res.status(404).json({ message: "Provider not found" });
//         }

//         const fieldsToUpdate = [
//             'name', 'email', 'number', 'BOD', 'address', 'Bname', 'Bnumber',
//             'password', 'Bemail', 'Bsocialmedia', 'B_GSTnumber', 'Btype', 'Bdetails',
//             'Btdsdetails', 'Bpancardnumber', 'Bformation', 'Baddress', 'collaborationCompany','collaborationMember',
//             'salespersonName', 'salespersonNumber', 'salespersonEmail', 'salespersonPosition',
//             'bankName', 'bankAccountnumber', 'bankIFSCcode', 'bankBranchname','upiid',
//         ];

//         fieldsToUpdate.forEach((field) => {
//             if (updatedData[field]) {
//                 existingProvider[field] = updatedData[field];
//             }
//         });

//         // Process file fields
//         const fileFields = ['profile', 'b_brochure', 'adharcard', 'pancard', 'gstfile', 'tdsfile', 'agreementfile'];
//         fileFields.forEach((field) => {
//             if (req.files[field]) {
//                 const newFilePath = iplink + req.files[field][0].filename;
//                 if (existingProvider[field] && existingProvider[field] !== iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg')) {
//                     const oldFilePath = existingProvider[field].replace(iplink, './files/');
//                     fs.unlinkSync(oldFilePath);
//                 }
//                 existingProvider[field] = newFilePath;
//             } else {
//                 if (existingProvider[field] && existingProvider[field] !== iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg')) {
//                     const oldFilePath = path.join('./files', existingProvider[field].replace(iplink, ''));
//                     fs.unlinkSync(oldFilePath);
//                 }
//                 existingProvider[field] = iplink + (field === 'profile' ? '/profile.png' : '/dummy.jpeg');
//             }
//         });

//         // Process 'product_service'
//         if (updatedData.productService) {
//             const productArray = [...new Set(updatedData.productService.split(',').map(item => item.trim()))].sort();
//             existingProvider.product_service = productArray;
//         }

//         // Process 'bsubcategoryid'
//         if (updatedData.sbcatid) {
//             const subcatArray = updatedData.sbcatid.split(',');
//             existingProvider.bsubcategoryid = subcatArray;
//         }

//         // Save the updated provider
//         const updatedProvider = await existingProvider.save();

//         res.status(200).json({
//             message: "Provider updated successfully",
//             provider: updatedProvider,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({
//             message: "Internal server error",
//         });
//     }
// };
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
            'Btdsdetails', 'Bpancardnumber', 'Bformation', 'Baddress', 'collaborationCompany', 'collaborationMember',
            'salespersonName', 'salespersonNumber', 'salespersonEmail', 'salespersonPosition',
            'bankName', 'bankAccountnumber', 'bankIFSCcode', 'bankBranchname', 'upiid',
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
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.add_bcategory = async (req, res) => {
    try {
        if (req.body) {
            let data = await bcategory.create(req.body)
            if (data) {
                res.json({
                    status: 200,
                    message: "Bussiness category added",
                    bussinessCategory: data
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.add_bformation = async (req, res) => {
    try {

        if (req.body) {
            let data = await bformation.create(req.body)
            if (data) {
                res.json({
                    status: 200,
                    message: "Bussiness Formation category added",
                    bussinessformation: data
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.add_product = async (req, res) => {
    try {
        if (req.body) {
            let data = await product.create(req.body)
            if (data) {
                res.json({
                    message: "Product added",
                    "product & service": data
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
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
        if (data) {
            res.json({
                message: "Show data",
                "product & service": data,
            })
        }
        else {
            res.status(200).json({
                message: "Data Empty"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
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
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.show_bcategory = async (req, res) => {
    try {
        let data = await bcategory.find()
        res.status(200).json({
            bcategory: data,
        })
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.show_cat_subcat = async (req, res) => {
    try {
        let data = await bsubcategory.find().populate('bcategoryid').exec()
        res.json({
            bsubcategory: data
        })
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
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
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
// User 
exports.adduser = async (req, res) => {
    var data = await user.find({})
    data = data.slice(-1)
    var ids = 0
    if (data[0] == undefined || data.length == 0) {
        ids = 1;
    } else {
        ids = data[0].ids + 1
    }
    try {
        const {
            name,
            email,
            number,
            DOB,
            occupation,
            reference,
            ref_no,
            address,
            bankname,
            bankaccount,
            bankifsc,
            bankbranch,
            upiid,
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
                bankname,
                bankaccount,
                bankifsc,
                bankbranch,
                upiid,
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
        res.status(400).json({
            message: "Internal server error"
        })
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
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.userdetails = async (req, res) => {
    try {
        let data = await user.findById(req.params.id)
        if (!data) {
            res.status(400).json({
                message: "User not found !"
            })
        }
        else {
            res.status(200).json({
                message: "User data",
                user: data,
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.deleteuser = async (req, res) => {
    try {
        let dataid = await user.findById(req.params.id)
        if (!dataid) {
            res.status(400).json({
                message: "User not found !"
            })
        }
        else {
            let data = await user.findByIdAndDelete(req.params.id)
            if (data) {
                res.status(200).json({
                    message: "User deleted successfully"
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.updateuser = async (req, res) => {
    try {
        const {
            name,
            email,
            number,
            DOB,
            occupation,
            reference,
            ref_no,
            address,
            bankname,
            bankaccount,
            bankifsc,
            bankbranch,
            upiid,
        } = req.body
        console.log(req.body, req.params.id);
        const password = await bcrypt.hash(number, 10);

        let data = await user.findByIdAndUpdate(req.params.id, {
            name,
            email,
            number,
            password,
            DOB,
            occupation,
            reference,
            ref_no,
            address,
            bankname,
            bankaccount,
            bankifsc,
            bankbranch,
            upiid,
        })
        if (data) {
            res.status(200).json({
                message: "User updated successfully",
                data,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.all_userform = async (req, res) => {
    try {
        const userForms = await userform.find({ status: false }).populate({
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
            }).sort({ createdAt: -1 })
            .exec()
        res.status(200).json({
            message: "All userforms",
            userForms,
        })
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.userform_details = async (req, res) => {
    try {
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

        res.status(200).json({
            order: data
        })

    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.today_order = async (req, res) => {
    try {
        // Get the current date and set it to the start of the day
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Get the end of today by adding 24 hours to the start date
        const endOfToday = new Date(currentDate);
        endOfToday.setHours(24, 0, 0, 0);

        const todayOrder = await userform.find({
            createdAt: {
                $gte: currentDate, // Greater than or equal to the start of today
                $lt: endOfToday,    // Less than the end of today
            }
        }).populate({
            path: 'productid',
            model: 'product', // Use the string 'product' as the model name
            populate: {
                path: 'bsubcategoryid',
                populate: {
                    path: 'bcategoryid'
                }
            }
        })
            .populate({
                path: 'userid',
                model: 'user', // Use the string 'user' as the model name
            })
            .exec();

        res.status(200).json({
            message: "Today orders",
            orders: todayOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.forward_order = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body) {
            const orderids = req.body.Orderid;
            const managerids = req.body.Managerid;
            if (!Array.isArray(orderids) || !Array.isArray(managerids)) {
                return res.status(400).json({
                    message: "Invalid input data"
                });
            }
            for (const managerId of managerids) {
                const Managerdata = await manager.findById(managerId);
                if (!Managerdata) {
                    return res.status(404).json({
                        message: `Manager with ID ${managerId} not found`
                    });
                }
                Managerdata.orderids = Managerdata.orderids.concat(orderids);
                await Managerdata.save();
            }
            res.status(200).json({
                message: "Orderids updated for the managers"
            });
        } else {
            res.status(400).json({
                message: "Invalid request data"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.done_order = async (req, res) => {
    try {
        let orders
            = await userform.find({
                payment: true,
            }).populate({
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
            }).populate({
                path: 'providerid',
                model: provider,
            }).exec();
        res.json({
            orders,
        })
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        });
    }
}
exports.showproduct = async (req, res) => {
    try {
        let data = req.body
        const products = await product.find({
            'bsubcategoryid': { $in: data },
        });
        const productValues = products.map(product => product.product);

        // Send the product values in the response
        res.json({ productService: productValues });

    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
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
        res.status(400).json({
            message: "Internal server error"
        })
    }
}

// Manager

exports.addmanager = async (req, res) => {
    try {
        let {
            name,
            email,
            number,
        } = req.body
        if (emptyobj(req.body)) {
            res.status(200).json({
                message: "All field required !"
            })
        }
        let data = await manager.findOne({ email: req.body.email })
        if (data) {
            res.json({
                message: "Account Already Registered",
            })
        }
        else {
            let password = await bcrypt.hash(number, 10)
            let data = await manager.create({
                name,
                email,
                number,
                password
            })
            if (data) {
                res.status(200).json({
                    message: "Manager added successfully 👍",
                    manager: data
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.delete_manager = async (req, res) => {
    try {
        let dataid = await manager.findById(req.params.id)
        if (!dataid) {
            res.status(400).json({
                message: "Manager not found !"
            })
        }
        else {
            let data = await manager.findByIdAndDelete(req.params.id)
            if (data) {
                res.status(200).json({
                    message: "Manager deleted successfully 👍"
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.update_manager = async (req, res) => {
    try {
        const {
            name,
            email,
            number,
        } = req.body
        const password = await bcrypt.hash(number, 10);

        let updateData = await manager.findByIdAndUpdate(req.params.id, {
            name,
            email,
            number,
            password,
        })
        if (updateData) {
            return res.status(200).json({
                message: "Manager updated successfully 👍",
                updateData,
            })
        }
        else {
            return res.status(200).json({
                message: "Manager not update 👎",
                updateData,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.allmanager = async (req, res) => {
    try {
        let data = await manager.find()
        res.status(200).json({
            message: "All manager",
            managers: data
        })
    } catch {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.manager_detail = async (req, res) => {
    try {
        console.log(req.params.id);
        let data = await manager.findById(req.params.id)
        if (!data) {
            return res.status(400).json({
                message: "Manager not found !"
            })
        }
        return res.status(200).json({
            message: "Manager data 👍",
            manager: data,
        })
    } catch (error) {
        return res.status(400).json({
            message: "Internal server error"
        })
    }
}