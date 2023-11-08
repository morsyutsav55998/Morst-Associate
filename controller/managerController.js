var manager = require('../model/manager')
var orders = require("../model/order")
var userform = require('../model/order')
var product = require("../model/category/product")
var provider = require('../model/provider')
var user = require('../model/user')
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken')
const { productid } = require('./adminController')
exports.login = async (req, res) => {
  try {
    const { email, number } = req.body
    const data = await manager.findOne({ email })
    if (data == null) {
      res.status(400).json({
        status: 400,
        message: "Sorry! Enter Valid Email",
      });
    }
    else {
      const managerNumber = await bcrypt.compare(number, data.password)
      if (managerNumber) {
        // Token genrate
        const token = await jwt.sign({ id: data.id }, process.env.managerkey)
        res.cookie('managertoken', token, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        res.status(200).json({
          message: 'Manager login successfully 👍',
          managertoken: token
        })
      }
      else {
        res.status(200).json({
          message: 'Sorry! Manager login password failed'
        })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Internal server error"
    })
  }
}

var otps = []
var emails = []

exports.checkemail = async (req, res, next) => {
  try {
    var managerData = await manager.findOne({ email: req.body.email })
    if (managerData) {
      var otp = Math.floor(1000 + Math.random() * 9000)
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
        auth: {
          user: 'utsavgarchar63@gmail.com', // Your email address
          pass: 'xzhv bdmj kapn eqgn' // Your email password or app-specific password
        }
      })
      const mailOptions = {
        from: 'utsavgarchar63@gmail.com',
        to: managerData.email, // Recipient's email address
        subject: 'Forgot Password',
        html: `<b>OTP : ${otp}</b>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email: ' + error);
        } else {
          console.log('Email sent: ' + info.response);

          res.status(200).json({
            message: "Mail Sent 👍",
            otp: otp
          })
          otps.push(otp)
          emails.push(managerData.email)
          next()
        }
      });
    }
    else {
      res.status(200).json({
        message: "Manager not found!"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    });
  }
}
exports.verify_otp = async (req, res) => {
  console.log(otps[0]);
  try {
    if (otps[0] == req.body.otp) {
      return res.status(200).json({
        status: true,
        message: "OTP Verify successfully 👍"
      })
    }
    else {
      return res.status(200).json({
        message: "OTP not Match !"
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.forgot_number = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.number == req.body.cnumber) {
      const managerEmail = await manager.findOne({ email: emails[0] })
      if (managerEmail) {
        var password = await bcrypt.hash(req.body.number, 10)
        const managerData = await manager.findByIdAndUpdate(managerEmail.id, {
          number: req.body.number,
          password,
        });
        if (managerData) {
          res.status(200).json({
            message: "Number changed successfully 👍"
          })

        }
      }
    }
    else {
      res.status(200).json({
        message: "Number & Confirm number not match !"
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.home = async (req, res) => {
  try {
    const managerId = req.manager
    let data = await manager.findById(managerId.id)
    if (data) {
      res.status(200).json({
        message: "Login manager data",
        manager: data
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.showorders = async (req, res) => {
  try {
    const managerId = req.manager
    let data = await manager.findById(managerId.id)
    const orderIds = data.orderids;
    const orderData = [];
    for (const orderId of orderIds) {
      const order = await orders.findById(orderId).populate({
        path: 'productid',
        model: product,
        populate: {
          path: 'bsubcategoryid',
          populate: {
            path: 'bcategoryid'
          }
        }
      }).populate({
        path: 'userid',
        model: user,
      }).sort({ createdAt: -1 }).exec();
      if (order) {
        if (order.status === false) {
          orderData.push(order);
        }
      } else {
        orderData.push({ error: `Order with ID ${orderId} not found` });
      }
    }
    res.json({
      message: "👍",
      adminorder: orderData
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.allprovider = async (req, res) => {
  try {
    var orderids = req.body
    console.log(orderids);
    var data = await orders.find({ _id: { $in: orderids } }).populate({
      path: 'productid',
      model: product,
      populate: {
        path: 'bsubcategoryid',
        populate: {
          path: 'bcategoryid'
        }
      }
    }).populate({
      path: 'userid',
      model: user,
    }).exec();
    
    const relevantData = data.map(provider => ({
      bussinesscategory: provider.productid.bsubcategoryid[0].bcategoryid.bussinesscategory,
      bussinesssubcategory: provider.productid.bsubcategoryid[0].bussinesssubcategory,
      product: provider.productid.product,
    }));
    // Get unique values of business category, subcategory, and product
    const uniqueBusinessCategories = [...new Set(relevantData.map((item) => item.bussinesscategory))];
    const uniqueBusinessSubcategories = [...new Set(relevantData.map((item) => item.bussinesssubcategory))];
    const uniqueProducts = [...new Set(relevantData.map((item) => item.product))];
    const productRegex = new RegExp(uniqueProducts.join('|'), 'i');
    // Query the provider database to find providers that match the criteria
    const providers = await provider.find({
      $or: [
        { "bussinesscategory": { $in: uniqueBusinessCategories } },
        { "bussinesssubcategory": { $in: uniqueBusinessSubcategories } },
        { "product_service": productRegex },
      ],
    }).populate({
      path: 'bsubcategoryid',
      populate: {
        path: 'bcategoryid bussinesssubcategory',
      },
    })
    res.json({ 
      providers,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Internal server error"
    })
  }
}

exports.provider_order = async (req, res) => {
  try {
    const orderids = req.body.orderid
    const providerids = req.body.providerid
    if (!Array.isArray(orderids) || !Array.isArray(providerids)) {
      return res.status(400).json({
        message: "Invalid input data"
      });
    }
    for (const providerId of providerids) {
      const providerData = await provider.findById(providerId);
      let providerEmail = providerData.email
      for (const orderId of orderids) {
        const orderData = await orders.findById(orderId).populate({
          path: 'productid',
          model: product,
          populate: {
            path: 'bsubcategoryid',
            populate: {
              path: 'bcategoryid'
            }
          }
        }).populate({
          path: 'userid',
          model: user,
        }).exec();
        console.log(orderData.product);
      }
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
        auth: {
          user: 'utsavgarchar63@gmail.com', // Your email address
          pass: 'xzhv bdmj kapn eqgn' // Your email password or app-specific password
        }
      });
      const mailOptions = {
        from: 'utsavgarchar63@gmail.com',
        to: providerEmail, // Recipient's email address
        subject: 'Order Detail',
        html: `<table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td bgcolor="#426899" align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                      <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                          <div style="display: block; font-family: poppins , Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">Morsy Affiliate</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#426899" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                      <tr>
                        <td bgcolor="#ffffff" align="left" valign="top" style="padding: 30px 30px 20px 30px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: poppins , Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                          <h3 style="font-size: 32px; font-weight: 400; margin: 0;font-weight:bold;">Member Order</h3>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                      <tr>
                        <td bgcolor="#ffffff" align="left">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <h4 align="left" valign="top" style="padding-left:30px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Order Details</h4>
                            
                            <tr>
                              <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Product/Service</th>
                              <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"></td>
                            </tr>
            
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td bgcolor="#ffffff" align="center">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <!-- <td bgcolor="#ffffff" align="center" style="padding: 30px 30px 30px 30px; border-top:1px solid #dddddd;">
                                <table border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td align="left" style="border-radius: 3px;" bgcolor="#426899">
                                      <a href="#" target="_blank" style="font-size: 20px; font-family: poppins , Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 2px; border: 1px solid #426899; display: inline-block;">Donwload</a>
                                    </td>
                                  </tr>
                                </table>
                              </td> -->
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                      <tr>
                        <td bgcolor="#ffffff" align="left">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <h4 align="left" valign="top" style="padding-left:30px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Order Details</h4>
                            
                            <tr>
                              <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Product</th>
                              <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td bgcolor="#ffffff" align="center">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <!-- <td bgcolor="#ffffff" align="center" style="padding: 30px 30px 30px 30px; border-top:1px solid #dddddd;">
                                <table border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td align="left" style="border-radius: 3px;" bgcolor="#426899">
                                      <a href="#" target="_blank" style="font-size: 20px; font-family: poppins , Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 2px; border: 1px solid #426899; display: inline-block;">Donwload</a>
                                    </td>
                                  </tr>
                                </table>
                              </td> -->
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"> <table border="0" cellpadding="0" cellspacing="0" width="480">
                    <tr>
                      <td bgcolor="#f4f4f4" align="left" style="padding: 30px 30px 30px 30px; color: #666666; font-family: poppins , Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                        <p style="margin: 0;">Diese E-Mail kommt von "<a href="https://company.de" target="_blank" style="color: #111111; font-weight: 700;">Morsy Affiliate<a>".</p>
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email: ' + error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      if (!providerData) {
        return res.status(404).json({
          message: `Provider with ID ${providerId} not found`
        });
      }
      providerData.orderids = providerData.orderids.concat(orderids);
      await providerData.save();
    }
    return res.status(200).json({
      message: "Orderids updated for the managers"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.orderdetail = async (req, res) => {
  try {
    const order = await orders.findById(req.params.id).populate({
      path: 'productid',
      model: product,
      populate: {
        path: 'bsubcategoryid',
        populate: {
          path: 'bcategoryid'
        }
      }
    }).populate({
      path: 'userid',
      model: user,
    }).exec();
    if (order) {
      res.status(200).json({
        message: "Order details",
        order,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}