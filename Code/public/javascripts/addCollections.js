var connection = require('./connection.js');
var fs = require('fs');
var path = require('path');
var parser = require('xml2json');
var http = require('http');

module.exports = function (req, res) {
    var loadfile = function () {
        var dataFolder = path.join(__dirname, "../../../Data");
        var songsCollection = {};
        var albumsCollection = [];
        fs.readdir(dataFolder, function (err, test) {
            var len = test.length;
            var count = 0;
            test.forEach(function (fileName) {
                fs.readFile(path.join(dataFolder, fileName), function (error, data) {
                    count++;
                    var json = JSON.parse(parser.toJson(data));
                    var albums = json.SONG.ALBUM;
                    if (albums != undefined) {
                        if (Array.isArray(albums)) {
                            albums.forEach(function (album) {
                                if (!(album in songsCollection)) {
                                    albumsCollection.push({ 'name': album });
                                    songsCollection[album] = [];
                                    songsCollection[album].push({ file: json.SONG.TITLE, content: json });
                                } else {
                                    songsCollection[album].push({ file: json.SONG.TITLE, content: json });
                                }
                            });
                        } else {
                            if (!(albums in songsCollection)) {
                                albumsCollection.push({ 'name': albums });
                                songsCollection[albums] = [];
                                songsCollection[albums].push({ file: json.SONG.TITLE, content: json });
                            } else {
                                songsCollection[albums].push({ file: json.SONG.TITLE, content: json });
                            }
                        }
                    }
                    if (count == len) {
                        connection.db.documents.query(
                            connection.qb.where(connection.qb.collection('albumsCollection'))
                        ).result().then(function (albumList) {
                            if (albumList.length <= 0) {
                                connection.db.createCollection('albumsCollection', { 'collections': albumsCollection }).result();
                            }
                        });
                        for (var albumName in songsCollection) {
                            connection.db.createCollection(albumName, songsCollection[albumName]).result()
                                .then(null, function (error) {
                                    console.log(JSON.stringify(error));
                                });
                        }
                    }
                });
            });
        });
    };

    connection.db.documents.removeAll({ directory: '/' }).result()
        .then(function (res) {
            loadfile();
        });
    res.redirect('/');
};