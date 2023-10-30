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
        ref:"product"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    otherName: {
        type: String
    },
    otherNumber: {
        type: String,
    },
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