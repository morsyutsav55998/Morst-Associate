var manager = require('../model/manager')
var orders = require("../model/userForm")
var product = require("../model/category/product")
var user = require('../model/user')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
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
                    message: 'Manager login successfully',
                    token: token
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
exports.home = async (req,res)=>{
    try {
        const managerId = req.manager
        let data = await manager.findById(managerId.id)
        if (data) {
            res.status(200).json({
                message : "Login manager data",
                manager: data
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}
exports.showorders = async (req,res)=>{
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