// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({

    name             : String,
    description      : String,
    total_slices     : Number,
    slice_cost       : Number,
    status           : String, // created, ordered, delivered
    orderer          : {
        email        : String,
        slices       : Number
    },
    groupies         : {
        groupie      : {
          email      : String,
          slices     : Number,
        }
    },
    location         : {
        latitude     : Number,
        longitude    : Number,
        description  : String,
    },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Order', orderSchema);
