const Movie = require("../models/Movie")

module.exports = {
  get1: {
    async postMovies(req, res) {
        try {
          var movie = new Movie({ ...req.body });
        const responce = await movie.save();
        res.status(201).json({ movie: responce });
      } catch (err) {
        if (err.name === 'ValidationError')
          return res.status(400).send(`Validation Error:${err.message}`);
        console.log(err.message);
        res.status(500).json({ message: 'server error', status: 500 });
      }
    },
  },
  post: {},
};
