const jwt = require('jsonwebtoken');
const provider = require('../model/provider');
const verifyToken = async (req, res, next) => {
    let token = req.headers.providertoken
    if (token) {
        var providerdata = await jwt.verify(token, process.env.providerkey, (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        })
        if(providerdata == undefined){
            res.status(200).json({
                message : "Token in valid",
            })
        }
        else{
            var data = await provider.findById(providerdata.id)
            if(data == null){
                res.status(400).json({
                    message : "Provider data not found"
                })
            }
            else{
                req.provider = data
                next()
            }
        }
    }
    else{
        res.status(200).json({
            status : 400,
            message :  'Provider login require'
        })
    }
}

module.exports = verifyToken