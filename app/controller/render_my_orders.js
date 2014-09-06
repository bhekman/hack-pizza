var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function renderMyOrders(user_email, max_orders, view, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  console.log(user_email);
  Order.find({ "orderer.email": user_email }, function(err,docs){
      if (err)
          console.log('error occured in the database');
      res.render(view, { orders : docs });
      // TODO(bhekman): fix order limiting
  })/*.limit(max_orders)*/;  
}

