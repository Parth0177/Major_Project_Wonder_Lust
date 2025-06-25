const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type:String,
  },
  description:{
    type:String,
  },
  images:{
    type:String,
  },
  price:{
    type:Number,
  },
  location:{
    type:String,
  },
  country:{
    type:String,
  }
});

const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;