var express = require('express');
var db = require('../models'); //brant's change
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
  res.render('events/search');
});

router.get('/results', function(req, res) {
  var eventUrl = "https://app.ticketmaster.com/discovery/v2/events.json?marketId=42&size=20&apikey=" + process.env.TMAPI_KEY + '&keyword=' + req.query.keyword;
  console.log(eventUrl);
  request(eventUrl, function(error, response, body) {
    if (!error && response.statusCode == 200 && (JSON.parse(body)._embedded)) {
        var dataObj = JSON.parse(body);
        console.log(dataObj._embedded.events);
        res.render('events/results', {results:dataObj._embedded.events});
      } else {
        req.flash('error', 'Search failed, please try again.');
        res.redirect('/events');
        console.log('SEARCH FAILED');
      }
  });
});

router.post('/events/:eventId', function(req, res) {
  console.log('IN THE EVENTS /POST ROUTE...');
  console.log(req.params.eventId);
});


module.exports = router;
