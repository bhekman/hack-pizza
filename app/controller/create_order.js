var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function createOrder(query, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = db.model('Order', orderSchema);

  // TODO(bhekman): validate query params (important).
  var new_order = new Order({
    name: query.name,
    description: query.description,
    total_slices: query.total_slices,
    slice_cost: query.slice_cost,
    status: 'created',
    orderer: {
      email: query.orderer_email,
      slices: query.orderer_slices
    },
    location: {
      latitude: query.latitude,
      longitude: query.longitude,
      description: query.location_description
    }
  });

  new_order.save(function (err) {
    if (err) 
          console.log('error occured in the database');
  })

  console.log("creation success!");
  res.send("success!");
}

