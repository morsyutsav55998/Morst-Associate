const provider = require("../model/provider")
const services = require('../model/provider_service')
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
        console.log(error);
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
        console.log(error);
    }
}

exports.addservice = async (req, res) => {
    console.log(req.body);
    try {
        let {
            service,
            description
        } = req.body

        const loginProvider = req.provider
        let providerid = loginProvider.id

        const files2 = req.files;
        const serviceimg = [];

        for (const file of files2) {
            const filepath = iplink + file.filename;
            serviceimg.push(filepath);
        }
        const data = await services.create({ service, description, providerid, serviceimg })
        console.log(data);
        if (data) {
            res.json({
                status: 200,
                message: "Provider service  added",
                serviceData: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}
exports.showservices = async (req, res) => {
    try {
        const providerId = req.provider
        const serviceId = await services.find({ providerid: providerId._id })
        // console.log(serviceId);
        if (serviceId) {
            res.json({
                message: "Your added services",
                services: serviceId,
            })
        }
    } catch (error) {
        console.log(error);
    }
}   