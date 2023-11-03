var manager = require('../model/manager')
var orders = require("../model/userForm")
var product = require("../model/category/product")
var user = require('../model/user')
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
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
exports.checkemail = async (req, res) => {
    try {
        var managerData = await manager.findOne({ email: req.body.email })
        if (managerData) {
            var otp =Math.floor(1000 + Math.random() * 9000);
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
                auth: {
                    user: 'utsavgarchar63@gmail.com', // Your email address
                    pass: 'xzhv bdmj kapn eqgn' // Your email password or app-specific password
                }
            });
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
                    res.status(200).json({
                        message: "Mail Sended 👍",
                        otp: otp
                    })
                    res.cookie('otp', otp);
                    res.cookie('email', managerData.email);

                    // Set a timeout to clear the OTP and email cookies after 5 minutes (300,000 milliseconds)
                    setTimeout(() => {
                        res.clearCookie('otp');
                        res.clearCookie('email');
                        console.log('OTP and email cookies cleared.');
                    }, 300000);
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        else {
            res.status(200).json({
                message: "Manager not found !"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.verify_otp = async (req, res) => {
    try {
        console.log(req.body,req.cookies.otp);
        if (req.cookies.otp == req.body.otp) {
            return res.status(200).json({
                status:true,
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
exports.forgot_number = async (req,res)=>{
    try {
        if (req.body.number == req.body.cnumber) {
            const managerEmail = await manager.findOne({ email: req.cookies.email })
            if (managerEmail) {
                 var password = await bcrypt.hash(req.body.number, 10)
                 const managerData = await manager.findByIdAndUpdate(managerEmail.id, {
                      number : req.body.number,
                      password,
                 });
                 if(managerData){
                    res.status(200).json({
                        message: "Number changed successfully 👍"
                    })
                    res.cookie('otp', '')
                    res.cookie('email', '')
                 }
            }
       }
       else {
            res.status(400).json({
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
            })
                .populate({
                    path: 'userid',
                    model: user,
                })
                .exec();
            if (order) {
                orderData.push(order);
            } else {
                orderData.push({ error: `Order with ID ${orderId} not found` });
            }
        }
        res.json({
            message: "👍",
            data: {
                orders: orderData,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Internal server error"
        })
    }
}