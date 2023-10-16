const jwt = require('jsonwebtoken');
const admin = require('../model/admin');
const verifyToken = async (req, res, next) => {
    let token = req.headers.token
    if (token) {
        var admindata = await jwt.verify(token, process.env.key, (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        })
        if(admindata == undefined){
            res.json({
                message : "Token in valid",
            })
        }
        else{
            var data = await admin.findById(admindata.id)
            if(data == null){
                res.json({
                    status : 400,
                    message : "Admin data not found"
                })
            }
            else{
                req.admin = data
                next()
            }
        }
    }
    else{
        res.json({
            status : 400,
            message :  'Admin login require'
        })
    }
}

module.exports = verifyToken