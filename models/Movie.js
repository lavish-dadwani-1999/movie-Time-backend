var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var movieSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    title: { type: String },
    tagline: { type: String },
    description: { type: String, trim: true, required: true },
    country: { type: String },
    production: { type: Object },
    genrec: [{ type: String }],
    language: { type: String },
    posterImage: { type: String },
    BackImage: { type: String },
    isPaid: { type: Boolean },
    movie: { type: Object }, // hear we will insert the movie having phase or marvel movie
    isReleased: { type: Boolean },
    runTime: { type: Number, default: 0 },
    releaseDate: { type: String, default: 0 },
    voteAverage: { type: Number, default: 0 },
    mediaType: { type: String, default: 'movie' },
    videoId: { type: String },
    adult: { type: Boolean },
    trending: { type: Number, default: 0 },
    phase: { type: Number },
    marvelMovie: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Movie = mongoose.model('movie', movieSchema);
module.exports = Movie;
