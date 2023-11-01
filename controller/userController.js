const user = require('../model/user')
const provider = require('../model/provider')
const services = require('../model/provider_service')
const bsubcategory = require('../model/category/bussiness_subcategory')
const bcategory = require('../model/category/bussiness_category')
const bcrypt = require('bcrypt')
const userForm = require('../model/userForm')
const nodemailer = require('nodemailer')
const product = require('../model/category/product')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

exports.login = async (req, res) => {
  try {
    const { email, number } = req.body
    const data = await user.findOne({ email })
    if (data == null) {
      res.status(400).json({
        status: 400,
        message: "Sorry! Enter Valid Email",
      });
    }
    else {
      const userNumber = await bcrypt.compare(number, data.password)
      if (userNumber) {
        // Token genrate
        const token = await jwt.sign({ id: data.id }, process.env.userkey)
        res.cookie('usertoken', token, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        console.log('User Login Successfully');
        res.status(200).json({
          message: 'User Login Successfully',
          usertoken: token
        })
      }
      else {
        console.log('Sorry! User Login Password Failed');
        res.status(200).json({
          message: 'Sorry! User Login Password Failed'
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
    const userId = req.user
    let data = await user.findById(userId.id)
    if (data) {
      res.status(200).json({
        Memberdata: data
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}

exports.allprovider = async (req, res) => {
  try {
    var data = await provider.find().populate({
      path: 'bsubcategoryid',
      populate: {
        path: 'bcategoryid bussinesssubcategory',
      },
    })
    res.status(200).json({
      message: "All provider",
      providers: data,
    })
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.search = async (req, res) => {
  try {
    var data = await provider.find().populate({
      path: 'bsubcategoryid',
      populate: {
        path: 'bcategoryid bussinesssubcategory',
      },
    });

    function convertDataToLowerCase(data) {
      return JSON.parse(JSON.stringify(data).toLowerCase());
    }

    data = convertDataToLowerCase(data);
    var utsav = [req.body.search];
    var searchTerms = convertDataToLowerCase(utsav);

    // Define an array of keys to exclude from the search
    const keysToExclude = ['_id', 'profile', 'b_brochure', 'adharcard', 'pancard', 'gstfile', 'tdsfile', 'agreementfile'];

    for (const term of searchTerms) {
      filteredData = deepSearchObjects(data, [term], keysToExclude);
    }

    res.json({
      // "String": JSON.stringify(filteredData),
      "JSON": filteredData,
    });

    function deepSearchObjects(objects, searchTerms, keysToExclude) {
      return objects.filter(obj => {
        const containsSearchTerm = searchInObject(obj, searchTerms, 0, keysToExclude);
        return containsSearchTerm;
      });
    }

    function searchInObject(obj, searchTerms, depth, keysToExclude) {
      if (depth > 10) {
        return false;
      }
      for (const key in obj) {
        // Check if the key is in the keysToExclude array
        if (keysToExclude.includes(key)) {
          continue; // Skip this key
        }
        if (typeof obj[key] === 'object') {
          if (searchInObject(obj[key], searchTerms, depth + 1, keysToExclude)) {
            return true;
          }
        } else if (typeof obj[key] === 'string') {
          if (searchTerms.some(term => obj[key].includes(term))) {
            return true;
          }
        }
      }
      return false;
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.providerdetails = async (req, res) => {
  try {
    console.log(req.params.id);
    let data = await provider.findById(req.params.id).populate({
      path: 'bsubcategoryid',
      populate: {
        path: 'bcategoryid bussinesssubcategory',
      },
    });
    res.status(200).json({
      provider: data
    })
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.show_products = async (req, res) => {
  try {
    let data = await product.find().populate({
      path: 'bsubcategoryid',
      populate: {
        path: 'bcategoryid bussinesssubcategory',
      },
    });
    res.json({
      message: "Show data",
      "form": data,
    })
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}
exports.adduserform = async (req, res) => {
  try {
    let userData = req.user
    let {
      description,
      productid,

      otherName,
      otherNumber,
    } = req.body
    let data = await userForm.create({
      userid: userData,
      description,
      productid,
      otherName,
      otherNumber,
    })
    if (data) {
      let productId = data.productid
      console.log(productId);
      let productData = await product.findById(productId).populate({
        path: 'bsubcategoryid',
        populate: {
          path: 'bcategoryid bussinesssubcategory',
        },
      });
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
        auth: {
          user: 'utsavgarchar63@gmail.com', // Your email address
          pass: 'xzhv bdmj kapn eqgn' // Your email password or app-specific password
        }
      });
      const mailOptions = {
        from: 'utsavgarchar63@gmail.com',
        to: '2in1fun2021@gmail.com', // Recipient's email address
        subject: 'Member Order',
        // html : `<h2>Member : ${userData.name}</h2> 
        // <h3>Product & Service : ${productData.product}</h3> 
        // `
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
                  <h4 align="left" valign="top" style="padding-left:30px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Member Details</h4>
                    
                    <tr>

                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Name</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.name}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Email</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.email}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Number</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.number}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Occupation</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.occupation}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Reference</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.reference}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Reference no</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.ref_no}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Address no</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${userData.address}</td>
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
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${productData.product}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Description</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${data.description}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Other name</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${data.otherName}</td>
                    </tr>
                    <tr>
                      <th align="left" valign="top" style="padding-left:50px;padding-right:15px;padding-bottom:10px; font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Other number</th>
                      <td align="left" valign="top" style="padding-left:15px;padding-right:30px;padding-bottom:10px;font-family: poppins , Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">${data.otherNumber}</td>
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
      res.status(200).json({
        message: "Your data created successfully",
        data,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Internal server error"
    })
  }
}