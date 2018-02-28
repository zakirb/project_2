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

router.delete('/favorites/:ticketmaster_id', isLoggedIn, function(req, res) {
  console.log('IN THE DELETE /favorites/ID route...');
  db.event.findOne({
    where: {ticketmaster_id : req.params.ticketmaster_id},
    include: [{model:db.user, where: {id:req.user.id}}]
  })
  .then(function(event) {
    event.removeUser(event.users[0])
  })
  .then(function() {
    db.event.findOne({
    where: {ticketmaster_id:req.params.ticketmaster_id},
    include: [db.user]
    })
    .then(function(event) {
      console.log(event);
      if (!event.users[0]) {
        event.destroy();
        console.log('DELETED EVENT');
        res.send('DELETED EVENT');
      } else {
        console.log('DIDNT DELETE EVENT BUT RELATION REMOVED');
        res.send('FAVORITE REMOVED');
      }
    });
  });
});

router.get('/favorites', isLoggedIn, function(req, res) {
  db.user.find({
    where: {id:req.user.id},
    include: [db.event]
  }).then(function(user) {
    // console.log(user.events);
    res.render('events/favorites', {events: user.events});
  });
});

router.post('/favorites', isLoggedIn, function(req, res) {
  console.log('IN THE FAVORITES /POST ROUTE...');
  db.event.findOrCreate({
    where: {ticketmaster_id:req.body.ticketmasterId},
    defaults: {
      name: req.body.name,
      purchase_url: req.body.purchaseUrl,
      image_url: req.body.imageUrl,
      date: req.body.date,
      venue: req.body.venue,
      location: req.body.location,
    }
  }).spread(function(event, created) {
    if (created) {
      db.user.findOne({
        where: {id:req.user.id}
      }).then(function(user) {
        event.addUser(user);
        console.log('CREATED');
        res.redirect('/events/favorites');
      });
    } else {
      db.user.findOne({
        where: {id:req.user.id}
      }).then(function(user) {
        event.addUser(user);
        console.log('NOT CREATED BUT USER ADDED');
        res.redirect('/events/favorites');
      });
  }
  });
});


module.exports = router;
