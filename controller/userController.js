const user = require('../model/user')
const provider = require('../model/provider')
const services = require('../model/provider_service')
const bsubcategory = require('../model/category/bussiness_subcategory')
const bcategory = require('../model/category/bussiness_category')
const bcrypt = require('bcrypt')
// const userForm = require('../model/userForm')
const product = require('../model/category/product')
const jwt = require('jsonwebtoken')

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
      const userNumber = await bcrypt.compare(number, data.number)
      if (userNumber) {
        // Token genrate
        const token = await jwt.sign({ id: data.id }, process.env.userkey)
        res.cookie('usertoken', token, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        console.log('User Login Successfully');
        res.status(200).json({
          status: 200,
          message: 'User Login Successfully',
          usertoken: token
        })
      }
      else {
        console.log('Sorry! User Login Password Failed');
        res.json({
          status: 400,
          message: 'Sorry! User Login Password Failed'
        })
      }
    }
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
}
// exports.search = async (req, res) => {
//   try {
//     var data = await provider.find().populate({
//       path: 'bsubcategoryid',
//       populate: {
//         path: 'bcategoryid bussinesssubcategory',
//       },
//     })
//     function convertDataToLowerCase(data) {
//       return JSON.parse(JSON.stringify(data).toLowerCase());
//     }
//     data = convertDataToLowerCase(data)
//     var utsav = [req.body.search]
//     var searchTerms = convertDataToLowerCase(utsav)
//     for (const term of searchTerms) {
//       filteredData = deepSearchObjects(data, [term])
//     }
//     // console.log(filteredData);
//     // console.log(JSON.stringify(filteredData));
//     res.json({
//       "Data in string": JSON.stringify(filteredData),
//       "Data in JSON": filteredData,

//     })
//     // console.log(filteredData); 
//     function deepSearchObjects(objects, searchTerms) {
//       return objects.filter(obj => {
//         const containsSearchTerm = searchInObject(obj, searchTerms, 0);
//         return containsSearchTerm;
//       })
//     }
//     function searchInObject(obj, searchTerms, depth) {
//       if (depth > 10) {
//         return false;
//       }
//       for (const key in obj) {
//         if (typeof obj[key] === 'object') {
//           if (searchInObject(obj[key], searchTerms, depth + 1)) {
//             return true;
//           }
//         } else if (typeof obj[key] === 'string') {
//           if (searchTerms.some(term => obj[key].includes(term))) {
//             return true;
//           }
//         }
//       }
//       return false;
//     }

//   } catch (error) {
//     console.log(error);
//   }
// }
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
    const keysToExclude = ['_id', 'profile', 'b_brochure','adharcard','pancard','gstfile','tdsfile','agreementfile'];

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
    console.log(error);
  }
}
exports.providerdetails = async (req,res)=>{
  try {
    console.log(req.params.id);
    let data = await provider.findById(req.params.id).populate({
      path: 'bsubcategoryid',
      populate: {
        path: 'bcategoryid bussinesssubcategory',
      },
    });
    res.json({
      provider : data
    })
  } catch (error) {
    console.log(error);
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
      console.log(error);
  }
}
exports.userform = async (req,res)=>{
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
}