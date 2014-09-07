var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function renderNearbyOrders(max_orders, view, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  Order.find({ $and:[
      { $or:[{'status': 'created'}, {'status': 'ordered'}]},
      { 'available_slices': { $gt: 0 }}
    ]}, function(err,docs){
      if (err)
          console.log('error occured in the database');
      console.log(docs);
      res.render(view, { orders : docs });
      // TODO(bhekman): fix order limiting
  })/*.limit(max_orders)*/;  
}

