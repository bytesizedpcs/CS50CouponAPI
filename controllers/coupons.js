const Coupon = require('../models/schemas/coupon.js');

// create a coupon
// saves a new coupon from Coupon Schema
// sends a response of 200
exports.createCoupon = function(req, res, next) {
  // validate input
  
  var newCoupon = new Coupon(req.body);
  
  newCoupon.save(function(err, coupon) {
    if (err) return next(err);
    
    return res.sendStatus(200);
  });
}

// gets all current coupons
exports.getAllCoupons = function(req, res, next) {
  Coupon.find({}, function(err, coupons) {
    if (err) return next(err);
    return res.json(coupons);
  });
}

// gets all active coupons
// finds coupons where:
// startdate is less than now
// the coupon is approved by admin
// the enddate is older than now
// or if the enddate doesn't exit
exports.getActiveCoupons = function(req, res, next) {
  var now = new Date();
  Coupon.find({
    $and: [
      { startDate: { $lt: now } },
      { approvedDate: { $exists: true } },
      { $or: [
        { endDate: { $gt: now } },
        { endDate: { $exists: false } }
      ]}
    ]
  }, function(err, coupons) {
    if (err) return next(err);

    return res.json(coupons);
  }); 
}

// gets all unapproved coupons
// finds all coupons where the approvedDate doesn't exist
exports.getUnapprovedCoupons = function(req, res, next) {
  Coupon.find({ approvedDate: { $exists: false } }, function(err, coupons) {
    if (err) return next(err);

    return res.json(coupons);
  });
}

// approve a coupon
// return the new update object
// finds a coupon by id
// and then changes the approvedDate to now
// if the id doesn't exit
// send back a 404 error
exports.approveCoupon = function(req, res, next) {
  Coupon.findOneAndUpdate(req.params.id, { approvedDate: new Date() },
    { new: true }, function(err, coupon) {
      if (err) return next(err);
      if (!coupon) return res.status(404).send('No coupon with that ID');

      return res.json(coupon);
    });
}

// gets a coupon by it's id
// if the id doesn't exist 
// send back a 404 error
exports.getCouponById = function(req, res, next) {
  Coupon.findById(req.params.id, function(err, coupon) {
    if (err) return next(err);
    if (!coupon) return res.status(404).send('No coupon with that ID');

    return res.json(coupon);
  });
}

// updates one coupon by it's id
// if the id doesn't exit
// send back a 404 error
exports.updateCoupon = function(req, res, next) {
  Coupon.findOneAndUpdate(req.params.id, req.body, 
    { new: true }, function(err, coupon) {
      if (err) return next(err);
      if (!coupon) return res.status(404).send('No coupon with that ID');

      return res.json(coupon);
    });
}

// deletes a coupon by it's id
// if the id doesn't exist
// send back a 404 error
exports.deleteCouponById = function(req, res, next) {
  Coupon.findOneAndRemove(req.params.id, function(err, coupon) {
    if (err) return next(err);
    if (!coupon) return res.status(404).send('No coupon with that ID');

    return res.sendStatus(200);
  });
}


