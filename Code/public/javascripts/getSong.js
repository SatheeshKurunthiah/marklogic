var connection = require('./connection.js');
var exec = require('child_process').exec;

function searchByQueryBuilder(req, res, song, render) {
    connection.db.documents.query(
        connection.qb.where(connection.qb.value('file', song))
    ).result().then(function (documents) {
        var songs = [];
        if (documents.length > 0) {
            documents.forEach(function (document) {
                var lines = [];
                document.content.content.SONG.LINE.forEach(function (line) {
                    lines.push(line);
                });
                songs.push({
                    title: document.content.content.SONG.TITLE,
                    album: document.content.content.SONG.ALBUM,
                    year: document.content.content.SONG.YEAR,
                    lines: lines
                });
            });
            return { render: render, songs: songs };
        } else {
            return null;
        }
    }).then(function (result) {
        if (!result)
            return res.status(500).json({ message: 'Collection not found' });
        if (result.render != undefined && result.render.indexOf('true') > -1) {
            return res.status(200).render('song', { songs: result.songs });
        } else {
            return res.status(200).json(result.songs);
        }
    });
};

function searchByApi(req, res, song, render) {
    var command = 'curl --anyauth --user satheesh:satheeshm93 -H "Accept: application/json" -X GET "http://localhost:8000/v1/search?q=' + song + '"';

    child1 = exec(command, function (error, stdout, stderr) {
        var json = JSON.parse(stdout);
        var len = json.results.length
        if (len > 0) {
            songs = [];
            var uniqueSongs = [];
            var count = 0;
            json.results.forEach(function (file) {
                var filePath = '"http://localhost:8000/v1/documents?uri=' + file.uri + '"'
                var curlCommand = 'curl --anyauth --user satheesh:satheeshm93 -H "Accept: application/json" -X GET ' + filePath
                child2 = exec(curlCommand, function (error, stdout, stderr) {
                    count++;
                    var fileJson = JSON.parse(stdout);
                    var lines = [];
                    if (fileJson.content != undefined) {
                        if (uniqueSongs.indexOf(fileJson.content.SONG.TITLE) < 0) {
                            fileJson.content.SONG.LINE.forEach(function (line) {
                                lines.push(line);
                            });
                            songs.push({
                                title: fileJson.content.SONG.TITLE,
                                album: fileJson.content.SONG.ALBUM,
                                year: fileJson.content.SONG.YEAR,
                                lines: lines
                            });
                        }
                        uniqueSongs.push(fileJson.content.SONG.TITLE);
                    }
                    if (count == len) {
                        if (render != undefined && render.indexOf('true') > -1) {
                            res.status(200).render('song', { songs: songs })
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
}

module.exports = function (req, res) {
    var song = req.query.name;
    var render = req.query.render;
    if (!song) {
        return res.status(500).json({ message: 'song name empty or null' });
    }
    searchByApi(req, res, song, render);
    // searchByQueryBuilder(req, res, song, render);
};