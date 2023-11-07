const jwt = require('jsonwebtoken');
const payment = require('../model/payment');
const verifyToken = async (req, res, next) => {
    let token = req.headers.providertoken
    if (token) {
        var paymentdata = await jwt.verify(token, process.env.paymentkey, (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        })
        if (paymentdata == undefined) {
            res.status(200).json({
                message: "Token in valid",
            })
        }
        else {
            var data = await payment.findById(paymentdata.id)
            if (data == null) {
                res.status(400).json({
                    message: "Payment panel data not found"
                })
            }
            else {
                req.payment = data
                next()
            }
        }
    }
    else {
        res.status(200).json({
            status: 400,
            message: 'Provider login require'
        })
    }
}

module.exports = verifyToken