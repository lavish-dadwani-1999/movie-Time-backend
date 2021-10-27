var express = require('express');
var dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const hbs = require('hbs');
require('./utils/passportGoogleAuth');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const tvShowsRoutes = require('./routes/tvShowsRoutes');
const watchListRoutes = require('./routes/watchListRoutes');
const subcriptionRoutes = require('./routes/subcriptionRoutes');
const passport = require('passport');
const session = require('express-session');
var app = express();
dotenv.config({ path: '.env' });
require('./db');
require('./utils/passport');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// hsb setting
app.set('view engine', 'hbs');
app.set('view option', { layout: 'layout' });

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

hbs.registerHelper('constructPassword', function () {
  return `/forgotPassword/${this.token}`;
});

app.use(session({ secret: 'lavi' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(movieRoutes);
app.use(userRoutes);
app.use(tvShowsRoutes);
app.use(watchListRoutes);
app.use(subcriptionRoutes);

app.get('/google/logout', (req, res) => {
  req.logOut();
  res.send({ message: 'logout' });
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'MulterError') return res.status(400).send(err.message);
  res.send(err.message);
});

module.exports = app;
