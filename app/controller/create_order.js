var val = require('validator');
var san = require('sanitizer');

var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function createOrder(user_email, query, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = db.model('Order', orderSchema);

  // Validation
  for( var attr in query) {
    if (val.isNull(attr)) {
      res.send(attr + " is null!");
      return;
    }
  }
  if (!val.isInt(query.total_slices)) {
    res.send("total_slices, " + san.sanitize(query.total_slices)
        + ", isn't an int!");
    return;
  }
  // available_slices is computed.
  if (!val.isFloat(query.slice_cost)) {
    res.send("slice_cost, " + san.sanitize(query.slice_cost)
        + ", isn't a float!");
    return;
  }
  // status is set to 'created'.
  if (val.isNull(user_email)) {
    res.send("user_email, " + san.sanitize(user_email)
        + ", is null!");
    return;
  }
  if (!val.isEmail(user_email)) {
    res.send("user_email, " + san.sanitize(user_email)
        + ", isn't a email!");
    return;
  }
  if (!val.isInt(query.orderer_slices)) {
    res.send("orderer_slices, " + san.sanitize(query.orderer_slices)
        + ", isn't an int!");
    return;
  }
  if (!val.isFloat(query.latitude)) {
    res.send("latitude, " + san.sanitize(query.latitude)
        + ", isn't a float!");
    return;
  }
  if (!val.isFloat(query.longitude)) {
    res.send("longitude, " + san.sanitize(query.longitude)
        + ", isn't a float!");
    return;
  }
  if (parseInt(query.orderer_slices) > parseInt(query.total_slices)) {
    res.send("orderer is taking more slices than possible: "
        + san.sanitize(query.orderer_slices) + " out of "
        + san.sanitize(query.total_slices));
    return;
  }
  console.log("Passed validation.");

  // Order Creation
  var new_order = new Order({
    name: san.sanitize(query.name),
    description: san.sanitize(query.description),
    total_slices: query.total_slices,
    available_slices: (query.total_slices - query.orderer_slices),
    slice_cost: query.slice_cost,
    status: 'created',
    orderer: {
      email: san.sanitize(user_email),
      slices: san.sanitize(query.orderer_slices),
    },
    location: {
      latitude: query.latitude,
      longitude: query.longitude,
      description: san.sanitize(query.location_description),
    }
  });

  new_order.save(function (err) {
    if (err) 
      console.log('error occured in the database');
    res.redirect('/order/' + new_order._id);
  });
}

