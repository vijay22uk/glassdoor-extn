// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Reviews', new Schema({ 
   companyName: String,
            reviewId: String,
            title: String,
            time:  { type: Date, default: Date.now },
            rating: String,
            authorInfo: String,
            recommends: String,
            pros: String,
            cons: String,
            adviceMgmt: String
}));