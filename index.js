require('dotenv').config();
var flash = require('connect-flash');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var request = require('request');
var db = require('./models');
var path = require('path');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

//sign session with secret
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  //before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  var user = req.user;
  res.render('profile', {user:user});
});

app.get('/profile/edit', isLoggedIn, function(req, res) {
  var user = req.user;
  res.render('editprofile', {user:user});
});

app.put('/profile', isLoggedIn, function(req, res) {
  db.user.update({
    zipcode: req.body.zipcode
  }, {
    where: {
      id:req.user.id
    }
  }).then(function(user) {
    res.render('profile', {user:user});
  });
});

app.use('/auth', require('./controllers/auth'));
app.use('/events', require('./controllers/events'));
app.use('/favorites', require('./controllers/favorites'));
app.use('/reccomendations', require('./controllers/reccomendations'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
