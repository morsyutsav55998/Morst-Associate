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
            // if (order) {
            //     orderData.push(order);
            // } else {
            //     orderData.push({ error: `Order with ID ${orderId} not found` });
            // }
            if (order) {
                // Check if the providerid in the order does not match req.provider.id
                if (!order.providerid.includes(req.provider.id)) {
                    orderData.push(order);
                }
            } else {
                orderData.push({ error: `Order with ID ${orderId} not found` });
            }
            
        }
        const filteredOrders = orderData.filter(order => !order.providerid.includes(req.provider.id));
        res.status(200).json({
            message: "👍",
            providerorder: filteredOrders
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
        console.log(req.params);
        let orderUpdate = await orders.findByIdAndUpdate(req.params.id, {
            status: true,
            providerid: data
        })
        if (orderUpdate) {
            res.status(200).json({
                message: 'Accepted succefully 😊'
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}