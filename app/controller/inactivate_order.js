var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function inactivateOrder(key, view, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  Order.findOne({ _id: key },function(err,doc){
      if (err || !doc)
          console.log('error occured in the database');
      doc.status = 'inactive';
      doc.save(function (err) {
        if (err)
          return handleError(err);
        res.send(order);
      });
      res.render(view, { order : doc });
  });
}
