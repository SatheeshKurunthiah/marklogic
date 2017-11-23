var express = require('express');
var router = express.Router();
var http = require("http");
var load = require('../public/javascripts/addCollections.js');
var remove = require('../public/javascripts/removeCollections.js');
var getalbum = require('../public/javascripts/getAlbum.js');
var getsong = require('../public/javascripts/getSong.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).render('index', { title: 'Marklogic Demo' });
});
router.get('/v1/load', load);
router.post('/v1/delete', remove);
router.get('/v1/album', getalbum);
router.get('/v1/song', getsong);
router.post('/v1/search/song', function (req, res) {
  res.redirect('/v1/song?render=true&name=' + req.body.songname);
});
router.post('/v1/search/album', function (req, res) {
  res.redirect('/v1/album?render=true&name=' + req.body.albumname);
  console.log(req.body);
});
router.post('/v1/load', function (req, res) {
  res.redirect('/v1/load');
});

module.exports = router;
