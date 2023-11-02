const provider = require("../model/provider")
const iplink = 'http://192.168.0.113:3000/'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
