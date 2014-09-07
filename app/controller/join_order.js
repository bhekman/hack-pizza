var val = require('validator');
var san = require('sanitizer');
var mongoose = require('mongoose');
var db_config = require('../../config/database.js');
var orderSchema = require('../models/order.js');

module.exports = function createOrder(groupie_email, query, res) {
  var db = mongoose.createConnection(db_config.url);
  var Order = db.model('Order', orderSchema);

  // Validation
  for( var attr in query) {
    if (val.isNull(attr)) {
      res.send(attr + " is null!");
      return;
    }
  }
  if (!val.isAlphanumeric(query.order_key)) {
    res.send("order_key, " + san.sanitize(query.order_key)
        + ", isn't alphanumeric!");
    return;
  }
  if (val.isNull(groupie_email)) {
    res.send("groupie_email, " + san.sanitize(groupie_email)
        + ", is null!");
    return;
  }
  if (!val.isEmail(groupie_email)) {
    res.send("groupie_email, " + san.sanitize(groupie_email)
        + ", isn't an email!");
    return;
  }
  if (!val.isInt(query.groupie_slices)) {
    res.send("groupie_slices, " + san.sanitize(query.groupie_slices)
        + ", isn't an int!");
    return;
  }
  if (parseInt(query.groupie_slices) <= 0) {
    res.send("must get at least one slice.");
    return;
  }

  var db = mongoose.createConnection(db_config.url);
  var Order = mongoose.model('Order', orderSchema);

  Order.findOne({ _id: san.sanitize(query.order_key) },function(err,doc){
      if (err) {
        console.log('error occured in the database');
        return;
      }
      if (doc.status != 'created' && doc.status != 'ordered') {
        res.send("status, " + san.sanitize(doc.status)
            + ", is not joinable!");
        return;
      }
      if (doc.available_slices < query.groupie_slices) {
        res.send("groupie requested more slices than are available.");
        return;
      }
      // TODO(bhekman): special case if groupie_email == orderer_email

      doc.groupies.push({
          email: san.sanitize(groupie_email),
          slices: san.sanitize(query.groupie_slices),
          delivered: false,
      });
      doc.available_slices = parseInt(doc.available_slices) - parseInt(query.groupie_slices);

      if (parseInt(doc.available_slices) == 0) {
        // TODO(bhekman): MAKE AN ACTUAL ORDER.
        doc.status = 'ordered';
      }
      console.log(doc);

      doc.save(function (err) {
        if (err) {
          console.log('error occured while saving: ' + err);
          return;
        }
        res.redirect('/order/' + san.sanitize(query.order_key));
      });
  });
}

