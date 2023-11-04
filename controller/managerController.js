var manager = require('../model/manager')
var orders = require("../model/userForm")
var userform = require('../model/userForm')
var product = require("../model/category/product")
var provider = require('../model/provider')
var user = require('../model/user')
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken')
const { productid } = require('./adminController')
exports.login = async (req, res) => {
    try {
        const { email, number } = req.body
        const data = await manager.findOne({ email })
        if (data == null) {
            res.status(400).json({
                status: 400,
                message: "Sorry! Enter Valid Email",
            });
        }
        else {
            const managerNumber = await bcrypt.compare(number, data.password)
            if (managerNumber) {
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.managerkey)
                res.cookie('managertoken', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                res.status(200).json({
                    message: 'Manager login successfully 👍',
                    managertoken: token
                })
            }
            else {
                res.status(200).json({
                    message: 'Sorry! Manager login password failed'
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Internal server error"
        })
    }
}

var otps=[]
var emails=[]

exports.checkemail = async (req, res, next) => {
    try {
        var managerData = await manager.findOne({ email: req.body.email })
        if (managerData) {
            var otp = Math.floor(1000 + Math.random() * 9000)
            const transporter = nodemailer.createTransport({
                service:'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
                auth: {
                    user: 'utsavgarchar63@gmail.com', // Your email address
                    pass: 'xzhv bdmj kapn eqgn' // Your email password or app-specific password
                }
            })
            const mailOptions = {
                from: 'utsavgarchar63@gmail.com',
                to: managerData.email, // Recipient's email address
                subject: 'Forgot Password',
                html: `<b>OTP : ${otp}</b>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email: ' + error);
                } else {
                    console.log('Email sent: ' + info.response);
                    
                    res.status(200).json({
                        message: "Mail Sent 👍",
                        otp: otp
                    })
                    otps.push(otp)
                    emails.push(managerData.email)
                    next()
                }
            });
        }
        else {
            res.status(200).json({
                message: "Manager not found!"
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        });
    }
}
exports.verify_otp = async (req, res) => {
    console.log(otps[0]);
    try {
        if (otps[0] == req.body.otp) {
            return res.status(200).json({
                status: true,
                message: "OTP Verify successfully 👍"
            })
        }
        else {
            return res.status(200).json({
                message: "OTP not Match !"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.forgot_number = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.number == req.body.cnumber) {
            const managerEmail = await manager.findOne({ email: emails[0] })
            if (managerEmail) {
                var password = await bcrypt.hash(req.body.number, 10)
                const managerData = await manager.findByIdAndUpdate(managerEmail.id, {
                    number: req.body.number,
                    password,
                });
                if (managerData) {
                    res.status(200).json({
                        message: "Number changed successfully 👍"
                    })
                    
                }
            }
        }
        else {
            res.status(200).json({
                message: "Number & Confirm number not match !"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.home = async (req, res) => {
    try {
        const managerId = req.manager
        let data = await manager.findById(managerId.id)
        if (data) {
            res.status(200).json({
                message: "Login manager data",
                manager: data
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.showorders = async (req, res) => {
    try {
        const managerId = req.manager
        let data = await manager.findById(managerId.id)
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
            adminorder: orderData
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.allprovider = async (req,res)=>{
    try {
        let data = await provider.find()
        res.status(200).json({
            message : "All providers",
            providers : data,
        })
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.provider_order = async (req, res) => {
    try {
        console.log(req.body);
        const orderids = req.body.orderid
        const providerids = req.body.providerid
        if (!Array.isArray(orderids) || !Array.isArray(providerids)) {
            return res.status(400).json({
                message: "Invalid input data"
            });
        }
        for (const providerId of providerids) {
            const providerData = await provider.findById(providerId);
            let providerEmail = providerData.email
            console.log(providerEmail);
            if (!providerData) {
                return res.status(404).json({
                    message: `Provider with ID ${providerId} not found`
                });
            }
            providerData.orderids = providerData.orderids.concat(orderids);
            await providerData.save();
        }
        return res.status(200).json({
            message: "Orderids updated for the managers"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Internal server error"
        })
    }
}