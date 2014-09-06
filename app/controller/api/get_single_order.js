var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function getOpenOrders(key, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  Order.findOne({ _id: key },function(err,docs){
      if (err)
          console.log('error occured in the database');
      res.json(docs);
  });
}

