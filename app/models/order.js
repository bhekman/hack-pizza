// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({
  name             : String,
  description      : String,
  total_slices     : Number,
  available_slices : Number,
  slice_cost       : Number,
  status           : String, // created, ordered, closed, inactive
  orderer          : {
    email        : String,
    slices       : Number
  },
  groupies         : [{
    email      : String,
    slices     : Number,
    delivered  : Boolean,
  }],
  location         : {
    latitude     : Number,
    longitude    : Number,
    description  : String,
  },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Order', orderSchema);
