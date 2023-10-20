const jwt = require('jsonwebtoken');
const provider = require('../model/provider');
const verifyToken = async (req, res, next) => {
    let token = req.headers.token
    if (token) {
        var providerdata = await jwt.verify(token, process.env.providerkey, (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        })
        if(providerdata == undefined){
            res.json({
                message : "Token in valid",
            })
        }
        else{
            var data = await provider.findById(providerdata.id)
            if(data == null){
                res.json({
                    status : 400,
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
        res.json({
            status : 400,
            message :  'Provider login require'
        })
    }
}

module.exports = verifyToken