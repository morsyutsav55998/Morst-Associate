const provider = require("../model/provider")
const jwt = require('jsonwebtoken')
exports.login = async (req,res)=>{
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
            if (data.number == number) {
                // Token genrate
                const token = await jwt.sign({ id: data.id }, process.env.providerkey)
                res.cookie('token', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
                // localStorage.setItem('token', token);
                res.status(200).json({
                    status: 200,
                    message: 'Provider Login Successfully',
                    token: token
                })
            }
            else {
                res.json({
                    status: 400,
                    message: 'Sorry! Provider Login Password Failed'
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}