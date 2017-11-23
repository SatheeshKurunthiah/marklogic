var connection = require('./connection.js');
var exec = require('child_process').exec;

function searchByApi(req, res, album, render) {
    var command = 'curl --anyauth --user satheesh:satheeshm93 -H "Accept: application/json" -X GET "http://localhost:8000/v1/search?q=' + album + '"';

    child1 = exec(command, function (error, stdout, stderr) {
        var json = JSON.parse(stdout);
        var len = json.results.length
        if (len > 0) {
            var songs = [];
            var uniqueSongs = [];
            var count = 0;
            json.results.forEach(function (file) {
                var filePath = '"http://localhost:8000/v1/documents?uri=' + file.uri + '"'
                var curlCommand = 'curl --anyauth --user satheesh:satheeshm93 -H "Accept: application/json" -X GET ' + filePath
                child2 = exec(curlCommand, function (error, stdout, stderr) {
                    count++;
                    var fileJson = JSON.parse(stdout);
                    if (fileJson.content != undefined && fileJson.content.SONG != undefined) {
                        if (uniqueSongs.indexOf(fileJson.content.SONG.TITLE) < 0) {
                            songs.push({
                                songName: fileJson.content.SONG.TITLE,
                            });
                        }
                        uniqueSongs.push(fileJson.content.SONG.TITLE);
                    }
                    if (count == len) {
                        if (render != undefined && render.indexOf('true') > -1) {
                            res.status(200).render('table', { songs: songs })
                        } else {
                            res.status(200).json(songs);
                        }
                    }
                });
            });
        } else {
            res.status(500).json({ message: 'Collection not found' });
        }

        if (error !== null) {
            res.status(500).json({ message: error });
        }

    });
};

function searchByQueryBuilder(req, res, album, render) {
    connection.db.documents.query(
        connection.qb.where(connection.qb.collection(album))
    ).result().then(function (documents) {
        var songs = [];
        if (documents.length > 0) {
            documents.forEach(function (document) {
                songs.push({ songName: document.content.file });
            });
            return { render: render, songs: songs };
        } else {
            return null;
        }
    }).then(function (result) {
        if (!result) {
            return res.status(500).json({ message: 'Collection not found' });
        }

        if (result.render != undefined && result.render.indexOf('true') > -1) {
            return res.status(200).render('table', { songs: result.songs });
        } else {
            return res.status(200).json(result.songs);
        }
    });
};

module.exports = function (req, res) {
    var album = req.query.name;
    var render = req.query.render;
    if (!album) {
        return res.status(500).json({ message: 'album name empty or null' });
    }
    searchByApi(req, res, album, render);
    // searchByQueryBuilder(req, res, album, render);
};