const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./models/config');

const users = require('./controllers/users.js');
const coupons = require('./controllers/coupons.js');
const auth = require('./controllers/auth');
const admins = require('./controllers/admins');

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, { server: { socketOptions: { KeepAlive: 120 } } });

var app = express();
var router = express.Router();

if (app.get('env') !== 'production') app.use(logger('dev'));
require('./init/init');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//===========================
//Middleware
//===========================
app.param('id', function(req, res, next, id) {
  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send('Invalid ID');

  next();
});

//===========================
// Routes
//===========================

app.get('/users', users.getUsers);
app.get('/users/:id', users.getUserById);
app.post('/users', users.createUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUserById);

app.post('/admins', admins.createAdmin);

app.get('/coupons', coupons.getAllCoupons);
app.get('/coupons/active', coupons.getActiveCoupons);
app.get('/coupons/unapproved', coupons.getUnapprovedCoupons);
app.put('/coupons/:id/approve', coupons.approveCoupon);
app.get('/coupons/:id', coupons.getCouponById);
app.post('/coupons', coupons.createCoupon);
app.put('/coupons/:id', coupons.updateCoupon);
app.delete('/coupons/:id', coupons.deleteCouponById);

// handle 404
// entered next();
app.use(function (req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next();
});

// removed next();
app.use(function (err, req, res) {
  console.log(err);
  res.status(err.status || 500).send();
});

var server = app.listen(config.port);
// console.log('Listening at http://localhost:%s in %s mode', server.address().port, app.get('env'));

module.exports = app;
