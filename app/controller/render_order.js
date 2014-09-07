var san = require('sanitizer');

var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function getOrder(user_email, key, view, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  Order.findOne({ _id: key },function(err,doc){
      if (err)
          console.log('error occured in the database');

      var is_owner = (user_email == doc.orderer.email);
      var is_groupie = false;
      for (var i=0; i<doc.groupies.length; i++) {
        if (doc.groupies[i].email == user_email) {
          is_groupie = true;
        }
      }
      res.render(view, { "order": doc, "is_owner": is_owner, "is_groupie": is_groupie });
  });
}
