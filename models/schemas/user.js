const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  firstName: {type: String, trim: true},
  lastName: {type: String, trim: true},
  classYear: Number,
  email: {type: String, unique: true, sparse: true, trim: true},
  phone: {type: String, unique: true, sparse: true},
  phoneProvider: {type: String, trim: true},
  isAdmin: {type: Boolean, index: true},
  isSuperAdmin: {type: Boolean, index: true},
  hash: String,
  companyName: {type: String, trim: true},
  interests: [String],
},
  {
    toObject: { getters: true },
    timeStamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

userSchema.pre('save', function(callback) {
  // run hook code
  if (this.isAdmin || this.isSuperAdmin) {
    if (!this.email)
      return callback(new Error('Missing email'));
    if (!this.hash)
      return callback(new Error('Missing password'));
    if (!this.companyName)
      return callback(new Error('Missing companyName'));

    if (this.isModified('hash'))
      this.hash = bcrypt.hashSync(this.hash);

   } else {
      if (!this.phone)
        return callback(new Error('Missing phone'));
      if (!this.phoneProvider)
        return callback(new Error('Missing phoneProvider'));
    }

    // validate phone
    if (this.phone) {
      if (typeof this.phone !== 'string')
        return callback(new Error('Invalid phone'));
      var phone = '';
      for (var i = 0; i < this.phone.length; i++) {
        if (!isNaN(this.phone[i]))
          phone += this.phone[i];
      }
      if (phone.length !== 10)
        return callback(new Error('Invalid phone'));
      this.phone = phone;
  }
  callback();
});

// create any methods
userSchema.virtual('name').get(function() {
  var name = "";
  if (this.firstNAme) {
    name = this.firstName;
    if (this.lastName) name += ' ' + this.lastName;
  } else if (this.lastName) {
    name = this.lastName;
  }
  return name;
});

// TODO: Method to check hashed password
userSchema.methods.checkPassword = function(pw, next) {
  bcrypt.compare(pw, this.hash, function(err, res) {
    if (err) return next(err);
    next(null, res);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
