var express = require('express');
var router = express.Router();
var load = require('../public/javascripts/addCollections.js');
var remove = require('../public/javascripts/removeCollections.js');
var getalbum = require('../public/javascripts/getAlbum.js');
var getsong = require('../public/javascripts/getSong.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).render('index', {
    title: 'Marklogic Demo'
  });
});

/* Loads the xml files into DB */
router.get('/v1/load', load);

/* Deletes all documents in album */
router.post('/v1/delete', remove);

/* GET all songs in album */
router.get('/v1/album', getalbum);

/* Get song details that match query string */
router.get('/v1/song', getsong);

/* Redirects from UI click to search for songs */
router.post('/v1/search/song', function (req, res) {
  res.redirect('/v1/song?render=true&name=' + req.body.songname);
});

/* Redirects from UI click to get songs in album */
router.post('/v1/search/album', function (req, res) {
  res.redirect('/v1/album?render=true&name=' + req.body.albumname);
  console.log(req.body);
});

/* Redirects from UI click to load xml files into DB */
router.post('/v1/load', function (req, res) {
  res.redirect('/v1/load');
});

module.exports = router;
