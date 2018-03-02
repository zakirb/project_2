var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var Geohash = require('latlon-geohash');
var zipcodes = require('zipcodes');

router.get('/', function(req, res) {
  var data;
  if (req.user) {
    data = req.user
  }
  res.render('events/search', {user: data});
});

router.get('/results', function(req, res) {

  var searchZip = req.query.zipcode;
  if (searchZip.length === 5) {
    var zipData = zipcodes.lookup(searchZip);
    var lat = zipData.latitude;
    var long = zipData.longitude;
    var searchGeohash = Geohash.encode(lat, long, 9);
  }

  var qs = {
    countryCode: 'US',
    size: 20,
    segmentName: 'music',
    sort: 'date,asc',
    apikey: process.env.TM_API_KEY,
    keyword: req.query.keyword,
    geoPoint: searchGeohash,
    units: 'miles',
    radius: req.query.radius
  };

  request({
    url: 'https://app.ticketmaster.com/discovery/v2/events.json',
    qs: qs
  }, function(error, response, body) {
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
