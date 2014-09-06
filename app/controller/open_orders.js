var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

// OPEN ORDERS ==============================
module.exports = function getOpenOrders(max_orders) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  var orders;
  Order.find({},function(err,docs){
      if (err)
          console.log('error occured in the database');
      console.log(docs);
      orders = docs
  }).limit(max_orders);  

  console.log(max_orders);
  return JSON.stringify(orders);
}

