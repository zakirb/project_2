var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', function(req, res) {
  res.render('events/search');
});

router.get('/results', function(req, res) {
  var eventUrl = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&size=20&apikey=" + process.env.TMAPI_KEY + '&sort=date,asc&keyword=' + req.query.keyword;

  request(eventUrl, function(error, response, body) {
    if (!error && response.statusCode == 200 && (JSON.parse(body)._embedded)) {
        var dataObj = JSON.parse(body);
        // console.log(dataObj._embedded.events);
        res.render('events/results', {results:dataObj._embedded.events});
      } else {
        req.flash('error', 'Search failed, please try again.');
        res.redirect('/events');
        console.log('SEARCH FAILED');
      }
  });
});

router.get('/favorites', isLoggedIn, function(req, res) {
  var data = 'All my favorites'; //placeholder
  res.render('events/favorites', {data:data})
});

router.post('/favorites', function(req, res) {
  console.log('IN THE FAVORITES /POST ROUTE...');

  db.event.findOrCreate({
    where: {ticketmaster_id:req.body.eventId},
    defaults: {
      name: req.body.name,
      purchase_url: req.body.purchaseUrl,
      image_url: req.body.imageUrl,
      date: req.body.date,
      venue: req.body.venue,
      location: req.body.location,
    }
  }).spread(function(event, created) {
    db.user.findOne({
      where: {id:req.user.id}
    }).then(function(user) {
      event.addUser(user);
    });
  });


});


module.exports = router;
