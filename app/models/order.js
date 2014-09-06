// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({

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

//// generating a hash
//userSchema.methods.generateHash = function(password) {
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//};

//// checking if password is valid
//userSchema.methods.validPassword = function(password) {
    //return bcrypt.compareSync(password, this.local.password);
//};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
