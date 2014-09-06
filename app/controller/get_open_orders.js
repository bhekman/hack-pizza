var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function getOpenOrders(max_orders, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  var orders = Order.find({},function(err,docs){
      if (err)
          console.log('error occured in the database');
      found_orders = JSON.stringify(docs);

      console.log(found_orders);
      res.send(found_orders);
  // TODO(bhekman): fix order limiting
  })/*.limit(max_orders)*/;  
}

