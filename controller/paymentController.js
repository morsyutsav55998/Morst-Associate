var payment = require('../model/payment')
var order = require('../model/order')
var product = require('../model/category/product')
var provider = require('../model/provider')
var user = require('../model/member')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
exports.login = async (req, res) => {
    try {
        const { email, number } = req.body
        const data = await payment.findOne({ email })
        if (data == null) {
            res.status(400).json({
                status: 400,
                message: "Sorry! Enter Valid Email",
            });
        }
        else {
            const paymentNumber = await bcrypt.compare(number, data.password)
            if (paymentNumber) {
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.paymentkey)
                res.cookie('paymenttoken', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                // localStorage.setItem('token', token);
                res.status(200).json({
                    status: 200,
                    message: 'Payment Panel Login Successfully',
                    paymenttoken: token
                })
            }
            else {
                res.status(400).json({
                    status: 400,
                    message: 'Sorry! Payment Panel Login Password Failed'
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        });
    }
}
exports.accept_order = async (req, res) => {
    try {
        let orders
            = await order.find({
                status: true,
                payment: false,
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


exports.comission_total = async (req, res) => {
    try {
        const users = await user.find();
        let totalMemberCommissionTotal = 0;
        let totalCompanyCommissionTotal = 0;
        let totalDealAmountTotal = 0; // Add this variable to keep track of the total deal amount
        const commissionTotals = {};
        
        for (const user of users) {
            const userId = user._id;
            const userName = user.name;

            let totalMemberCommission = 0;
            let totalCompanyCommission = 0;
            let totalOrders = 0;
            var userDealAmount = 0; // Add this variable to calculate the total deal amount for the user

            const userOrders = await order.find({ userid: userId });

            for (const order of userOrders) {
                totalMemberCommission += parseInt(order.memberCommission) || 0;
                totalCompanyCommission += parseInt(order.companyCommission) || 0;
                totalOrders++;
                userDealAmount += parseInt(order.dealamount) || 0; // Add the deal amount to the user's total deal amount
            }
            commissionTotals[userId] = {
                userId,
                userName,
                totalOrders,
                totalMemberCommission,
                totalCompanyCommission,
                userDealAmount, // Include user's total deal amount in the commissionTotals
            };

            totalMemberCommissionTotal += totalMemberCommission;
            totalCompanyCommissionTotal += totalCompanyCommission;
            totalDealAmountTotal += userDealAmount; // Add the user's total deal amount to the overall total
        }

        res.json({ 
            commissionTotals, 
            totalMemberCommissionTotal, 
            totalCompanyCommissionTotal, 
            totalDealAmountTotal, // Include the total deal amount in the response
            totalComission: totalMemberCommissionTotal + totalCompanyCommissionTotal,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

