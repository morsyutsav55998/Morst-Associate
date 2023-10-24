const jwt = require('jsonwebtoken');
const user = require('../model/user');
const verifyToken = async (req, res, next) => {
    let token = req.headers.usertoken
    if (token) {
        var userdata = await jwt.verify(token, process.env.userkey, (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        })
        if(userdata == undefined){
            res.json({
                message : "Token in valid",
            })
        }
        else{
            var data = await user.findById(userdata.id)
            if(data == null){
                res.json({
                    status : 400,
                    message : "User data not found"
                })
            }
            else{
                req.user = data
                next()
            }
        }
    }
    else{
        res.json({
            status : 400,
            message :  'User login require'
        })
    }
}

module.exports = verifyToken