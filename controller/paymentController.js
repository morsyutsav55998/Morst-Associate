var payment = require('../model/payment')
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