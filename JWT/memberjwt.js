const jwt = require('jsonwebtoken');
const user = require('../model/member');
const verifyToken = async (req, res, next) => {
    let token = req.headers.usertoken
    if (token) {
        var userdata = await jwt.verify(token, process.env.userkey, (err, data) => {
            if(err){
                console.log(err);
            }
            return data
        })
        if(userdata == undefined){
            res.status(400).json({
                message : "Token invalid",
            })
        }
        else{
            var data = await user.findById(userdata.id)
            if(data == null){
                res.status(400).json({
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
        res.status(400).json({
            message :  'User login require'
        })
    }
}

module.exports = verifyToken