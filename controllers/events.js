var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', function(req, res) {
  var data;
  if (req.user) {
    data = req.user
  }
  res.render('events/search', {user: data});
});

router.get('/results', function(req, res) {
  var eventUrl = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&size=20&apikey=" + process.env.TM_API_KEY + '&segmentName=music&sort=date,asc&keyword=' + req.query.keyword;
  
  request(eventUrl, function(error, response, body) {
    if (!error && response.statusCode == 200 && (JSON.parse(body)._embedded)) {
        var dataObj = JSON.parse(body);
        // console.log(dataObj._embedded.events);
        res.render('events/results', {results:dataObj._embedded.events});
      } else {
        req.flash('error', 'No events found, please try again');
        res.redirect('/events');
        console.log('SEARCH FAILED');
      }
  });
});




module.exports = router;
