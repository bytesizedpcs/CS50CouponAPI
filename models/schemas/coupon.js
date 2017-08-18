const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let couponSchema = new Schema({
    name: {type: String, required: true, trim: true},
    url: {type: String, required: true, trim: true},
    companyName: {type: String, required: true, trim: true}, 
    startDate: {type: Date, default: Date.now, index: true},
    endDate: {type: Date, index: true},
    tags: [Number],
    clicks: {type: [Date], default: []},
    views: {type: Date, index: true},
    redeemed: {type: [Date], default: []},
    postedBy: Schema.ObjectId,
    approvedDate: Date,
  },
  {
    toObject: { getters: true },
    timeStamps: {
      createdAt: 'createdDate',
      updateAt: 'updatedDate'
    }
  }
);

couponSchema.pre('save', function(callback) {
  if (this.url && !(/^((https?)|(ftp)):\/\/.+/.test(this.url)))
    this.url = 'http://' + this.url;
  if (this.isModified('approvedDate') && this.approvedDate > this.startDate)
    this.startDate = this.approvedDate;

  callback();
});

var Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
