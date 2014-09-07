var san = require('sanitizer');
var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function confirmDelivery(groupie_email, order_key, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = db.model('Order', orderSchema);

  Order.findOne({ _id: san.sanitize(order_key) },function(err,doc){
      if (err) {
        console.log('error occured in the database');
        return;
      }
      for (var i=0; i<doc.groupies.length; i++) {
        if (doc.groupies[i].email == groupie_email) {
          doc.groupies[i].delivered = true;
        }
      }

      doc.save(function (err) {
        if (err)
          return handleError(err);
        res.redirect('/order/' + san.sanitize(order_key));
      });
  });
}


