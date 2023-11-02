const jwt = require('jsonwebtoken');
const manager = require('../model/manager');
const verifyToken = async (req, res, next) => {
    let token = req.headers.managertoken
    if (token) {
        var managerdata = await jwt.verify(token, process.env.managerkey, (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        })
        if(managerdata == undefined){
            res.json({
                message : "Token in valid",
            })
        }
        else{
            var data = await manager.findById(managerdata.id)
            if(data == null){
                res.json({
                    status : 400,
                    message : "Manager data not found"
                })
            }
            else{
                req.manager = data
                next()
            }
        }
    }
    else{
        res.json({
            status : 400,
            message :  'Manager login require'
        })
    }
}

module.exports = verifyToken