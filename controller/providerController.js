var provider = require("../model/provider")
var iplink = 'http://192.168.0.113:3000/'
var bsubcategory = require('../model/category/bussiness_subcategory')
var orders = require('../model/order')
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
        subcatData: subcatData
    })
}
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
        const Id = req.provider
        let data = await provider.findById(Id.id)
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
                if (order.status !== true) {
                    // Only add orders with status "true" (accepted)
                    orderData.push(order);
                }
            } else {
                orderData.push({ error: `Order with ID ${orderId} not found` });
            }
        }
        res.status(200).json({
            message: "👍",
            providerorder: orderData
        });
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.accept_order = async (req, res) => {
    try {
        let data = req.provider.id
        let orderUpdate = await orders.findByIdAndUpdate(req.params.id, { $push: { providerid: data }, status: true })
        if (orderUpdate) {
            res.status(200).json({
                message: 'Accepted succefully 👍'
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.accepted_orders = async (req, res) => {
    try {
        const Id = req.provider
        let data = await provider.findById(Id.id)
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
                if (order.status === true && order.payment !== true) {
                    orderData.push(order);
                }
            } else {
                orderData.push({ error: `Order with ID ${orderId} not found` });
            }

        }
        res.status(200).json({
            message: "👍",
            providerorder: orderData
        });
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}

// exports.tracking = async (req, res) => {
//     const name = req.params.name;
//     console.log(req.params);
//     console.log(req.body); 
//     const allowedNames = ["call", "meeting", "deal","amount", "work", "payment", ];

//     if (!allowedNames.includes(name)) {
//       return res.status(200).json({
//         message: "Invalid name provided",
//       });
//     }

//     try {
//       const order = await orders.findById(req.params.id);

//       if (!order) {
//         return res.status(200).json({
//           message: "Order not found",
//         });
//       }

//       if (name === "amount" && req.body.dealamount !== undefined) {
//         // Update the "amount" field in the order with the value from req.body.amount
//         order.dealamount = req.body.dealamount;
//         await order.save();
//       } else {
//         // Define the order of fields
//         const fieldOrder = ["call", "meeting","amount", "deal", "work", "payment"];

//         // Find the index of the current field
//         const currentIndex = fieldOrder.indexOf(name);

//         // Check if the previous field is true
//         if (currentIndex > 0 && !order[fieldOrder[currentIndex - 1]]) {
//           return res.status(200).json({
//             message: `Cannot set '${name}' to true without setting '${fieldOrder[currentIndex - 1]}' to true first.`,
//           });
//         }

//         // Set the current field to true
//         order[name] = true;
//         await order.save();
//       }

//       return res.status(200).json({
//         message: "👍",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(200).json({
//         message: "Internal Server Error",
//       });
//     }
//   };
exports.tracking = async (req, res) => {
    const data = req.provider
    console.log(data.collaborationMember);
    const name = req.params.name;
    const allowedNames = ["call", "meeting", "deal", "amount", "work", "payment"];

    if (!allowedNames.includes(name)) {
        return res.status(200).json({
            message: "Invalid name provided",
        });
    }

    try {
        const order = await orders.findById(req.params.id);

        if (!order) {
            return res.status(200).json({
                message: "Order not found",
            });
        }

        // Define the order of fields
        const fieldOrder = ["call", "meeting", "deal", "amount", "work", "payment"];

        // Find the index of the current field
        const currentIndex = fieldOrder.indexOf(name);

        // If the current field is "amount" and there is a dealamount in the request body, update it
        if (name === "amount" && req.body.dealamount !== undefined) {
            order.dealamount = req.body.dealamount;
        }

        // Check if the previous field is true, except for the first field
        if (currentIndex > 0 && !order[fieldOrder[currentIndex - 1]]) {
            return res.status(200).json({
                message: `Cannot set '${name}' to true without setting '${fieldOrder[currentIndex - 1]}' to true first.`,
            });
        }

        // Set the current field to true
        order[name] = true;

        if (name === "payment" && order.payment) {
            // If "payment" is true, calculate and store the commission
            const dealamount = parseFloat(order.dealamount);
            const collaborationMemberPercentage = parseFloat(data.collaborationMember) / 100;
            const memberCommission = dealamount * collaborationMemberPercentage;
            order.memberCommission = memberCommission;

            const dealamount_ = parseFloat(order.dealamount);
            const collaborationCompanyPercentage = parseFloat(data.collaborationCompany) / 100;
            const companyCommission = dealamount_ * collaborationCompanyPercentage;
            order.companyCommission = companyCommission;
        }
        let updatedData = await order.save();

        return res.status(200).json({
            message: "👍",
        });
    } catch (error) {
        return res.status(200).json({
            message: "Internal Server Error",
        });
    }
};
exports.completed_order = async (req, res) => {
    try {
        const Id = req.provider
        let data = await provider.findById(Id.id)
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
                if (order.payment === true) {
                    orderData.push(order);
                }
            } else {
                orderData.push({ error: `Order with ID ${orderId} not found` });
            }

        }
        res.status(200).json({
            message: "👍",
            completed: orderData
        });
    } catch (error) {
        return res.status(200).json({
            message: "Internal Server Error",
        });
    }
}