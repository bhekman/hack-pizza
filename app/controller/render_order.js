var san = require('sanitizer');

var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function getOrder(key, view, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  Order.findOne({ _id: key },function(err,docs){
      if (err)
          console.log('error occured in the database');
      console.log(docs);
      res.render(view, { order : docs });
  });
}
