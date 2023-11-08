const mongoose = require('mongoose');
const userformSchema = new mongoose.Schema({
  no: {
    type: Number, default: 0
  },
  description: {
    type: String
  },
  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  providerid: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  budget: {
    type: String
  },
  otherName: {
    type: String
  },
  otherNumber: {
    type: String,
  },
  otherEmail: {
    type: String,
  },
  providerid: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  providercommission:{
    type: String,
  },
  status: {
    type: Boolean,
  },
  call :{
    type: Boolean,
  },
  meeting :{
    type: Boolean,
  },
  deal :{
    type: Boolean,
  },
  amount :{
    type: Boolean,
  },
  dealamount:{
    type: String,
  },
  work :{
    type: Boolean,
  },
  payment :{
    type: Boolean,
  },
  memberCommission :{
    type: String,
  },
  companyCommission :{
    type: String,
  },
}, {
  timestamps: true
});
userformSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const latestEntry = await this.constructor.findOne({}, {}, { sort: { no: -1 } });
      if (latestEntry) {
        this.no = latestEntry.no + 1;
      } else {
        this.no = 1;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('userform', userformSchema); 