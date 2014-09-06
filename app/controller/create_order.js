var val = require('validator');
var san = require('sanitizer');

var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function createOrder(query, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = db.model('Order', orderSchema);

  // Validation
  for( var attr in query) {
    if (val.isNull(attr))
      res.send(attr + " is null!");
  }
  if (!val.isInt(query.total_slices))
    res.send("total_slices " + san.sanitize(query.total_slices)
        + " isn't an int!");
  if (!val.isFloat(query.slice_cost))
    res.send("slice_cost " + san.sanitize(query.slice_cost)
        + " isn't a float!");
  if (!val.isEmail(query.orderer_email))
    res.send("orderer_email isn't an email!");
  if (!val.isInt(query.orderer_slices))
    res.send("orderer_slices isn't a Int!");
  if (!val.isFloat(query.latitude))
    res.send("latitude isn't a float!");
  if (!val.isFloat(query.longitude))
    res.send("longitude isn't a float!");
  console.log("Passed validation.");

  // Order Creation
  var new_order = new Order({
    name: san.sanitize(query.name),
    description: san.sanitize(query.description),
    total_slices: query.total_slices,
    slice_cost: query.slice_cost,
    status: 'created',
    orderer: {
      email: san.sanitize(query.orderer_email),
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
  })

  res.send("success, order created!");
}

