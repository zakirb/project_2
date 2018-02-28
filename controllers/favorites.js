var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');



router.get('/reccomend', function(req, res) {


  var qs = {
    q: 'kaskade,autograf, bonnaroo music festival',
    type: 'music',
    info: 0,
    k: process.env.TASTE_API_KEY
  };
  request({
    url: 'https://tastedive.com/api/similar',
    qs: qs
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var dataObj = JSON.parse(body);
      res.send(dataObj);
    } else {
      res.redirect('/favorites');
    }
  });
});



router.get('/:ticketmaster_id', isLoggedIn, function(req, res) {
  var eventUrl = "https://app.ticketmaster.com/discovery/v2/events/" + req.params.ticketmaster_id + ".json?&apikey=" + process.env.TM_API_KEY;

  request(eventUrl, function(error, response, body) {
    if (!error && response.statusCode == 200 && (JSON.parse(body)._embedded)) {
        var dataObj = JSON.parse(body);
        console.log(dataObj);
        var artistList = [];
        var artists = dataObj._embedded.attractions;
        artists.forEach(function(artist) {
          artistList.push(artist.name);
        });

        
        var qs = {
          q: artistList.join(','),
          type: 'music',
          info: 0,
          k: process.env.TASTE_API_KEY
        };
        request({
          url: 'https://tastedive.com/api/similar',
          qs: qs
        }, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var recs = JSON.parse(body);
            res.send(recs.Similar.Results);
            // res.render('favorites/show', {data:recs});
          } else {
            res.redirect('/favorites');
          }
        });

      } else {
        req.flash('error', 'Error finding event information');
        res.redirect('/favorites');
        console.log('SEARCH FAILED');
      }
  });
});



router.delete('/:ticketmaster_id', isLoggedIn, function(req, res) {
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

router.get('/', isLoggedIn, function(req, res) {
  db.user.find({
    where: {id:req.user.id},
    include: [db.event]
  }).then(function(user) {
    // console.log(user.events);
    res.render('favorites/showAll', {events: user.events});
  });
});

router.post('/', isLoggedIn, function(req, res) {
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
        res.redirect('/favorites');
      });
    } else {
      db.user.findOne({
        where: {id:req.user.id}
      }).then(function(user) {
        event.addUser(user);
        console.log('NOT CREATED BUT USER ADDED');
        res.redirect('/favorites');
      });
  }
  });
});




module.exports = router;
