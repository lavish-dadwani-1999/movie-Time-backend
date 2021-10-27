const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TvShowsSchema = new Schema({
  title: { type: String, required: true, trim: true},
  name: { type: String, required: true, trim: true},
  episodes: [
    {
      season: Number,
      episode: Number,
      Title: String,
      Description: String,
      imageUrl: { type: String },
      videoId: { type: String },
      runTime: { type: Number },
    },
  ],
  description: { type: String },
  adult: { type: Boolean },
  isPaid: { type: Boolean },
  releaseDate: { type: Date },
  trending: { type: Number,default:0 },
  posterImage: { type: String },
  mediaType:{type:String,default:"tvShow"},
  voteAverage:{type:Number,default:0},
  language:{type:String,default:"English"},
  country: { type: String,default:"US" },
  genrec: [{ type: String }],
  isReleased: { type: Boolean,default:true},
},{timestamps:true});


const TvShow = mongoose.model("tvshow",TvShowsSchema)

module.exports = TvShow