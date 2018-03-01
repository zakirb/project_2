var express = require('express');
var db = require('../models');
var router = express.Router();
var request = require('request');


router.get('/:artistname', function(req, res) {
  var qs = {
    q: req.params.artistname,
    type: 'music',
    info: 1,
    k: process.env.TASTE_API_KEY
  };
  request({
    url: 'https://tastedive.com/api/similar',
    qs: qs
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var recs = JSON.parse(body);
      res.render('reccomendations/show', {artists:recs.Similar.Results, info:recs.Similar.Info[0]});
    } else {
      res.redirect('/favorites');
    }
  });
});



module.exports = router;
