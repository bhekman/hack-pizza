var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
var val = require('validator');
var san = require('sanitizer');
var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function createOrder(user_email, body, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = db.model('Order', orderSchema);

  // Validation
  for( var attr in body) {
    if (val.isNull(attr)) {
      res.send(attr + " is null!");
      return;
    }
  }
  if (!val.isInt(body.total_slices)) {
    res.send("total_slices, " + san.sanitize(body.total_slices)
        + ", isn't an int!");
    return;
  }
  if (parseInt(body.total_slices) < 0) {
    res.send("must create at least one slice.");
    return;
  }
  // available_slices is computed.
  if (!val.isFloat(body.slice_cost)) {
    res.send("slice_cost, " + san.sanitize(body.slice_cost)
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
  if (!val.isInt(body.orderer_slices)) {
    res.send("orderer_slices, " + san.sanitize(body.orderer_slices)
        + ", isn't an int!");
    return;
  }
  if (parseInt(body.orderer_slices) < 0) {
    res.send("must order at least one slice.");
    return;
  }
  if (!val.isFloat(body.latitude)) {
    res.send("latitude, " + san.sanitize(body.latitude)
        + ", isn't a float!");
    return;
  }
  if (!val.isFloat(body.longitude)) {
    res.send("longitude, " + san.sanitize(body.longitude)
        + ", isn't a float!");
    return;
  }
  if (parseInt(body.orderer_slices) > parseInt(body.total_slices)) {
    res.send("orderer is taking more slices than possible: "
        + san.sanitize(body.orderer_slices) + " out of "
        + san.sanitize(body.total_slices));
    return;
  }
  console.log("Passed validation.");
  console.log(body);

  var stripeToken = JSON.parse(body.token); // obtained with Stripe.js
  console.log(stripeToken);
  var charge = stripe.charges.create({
    amount: (body.slice_cost * body.orderer_slices) * 100, // TODO(bhekman): is there a way to access this?
    currency: "usd",
    card: stripeToken.id, // obtained with Stripe.js
    description: "Charge for hack-pizza." // TODO(bhekman): Make use of ordername.
  }, function(err, charge) {
    if (err) {
      console.log('error occured while making charge: ' + err);
      return;
    }
    console.log('Made charge successfully: ' + charge.id + ' for ' + charge.amount);
  });

  // Order Creation
  var new_order = new Order({
    name: san.sanitize(body.name),
    description: san.sanitize(body.description),
    total_slices: body.total_slices,
    available_slices: (body.total_slices - body.orderer_slices),
    slice_cost: body.slice_cost,
    status: 'created',
    orderer: {
      email: san.sanitize(user_email),
      slices: san.sanitize(body.orderer_slices),
    },
    location: {
      latitude: body.latitude,
      longitude: body.longitude,
      description: san.sanitize(body.location_description),
    }
  });

  new_order.save(function (err) {
    if (err) {
      console.log('error occured in the database');
      return;
    }
    res.redirect('/order/' + new_order._id);
  });
}

