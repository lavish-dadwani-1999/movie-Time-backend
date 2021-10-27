const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WatchListSchema = new Schema({
  userId: { type: String},
   movieId: { type: String },
    movieObj: { type: Object } 
},{timestamps:true});

const WatchList = mongoose.model("watchList",WatchListSchema)

module.exports = WatchList
