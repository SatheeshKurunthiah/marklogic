var connection = require('./connection.js');

module.exports = function (req, res) {
    var album = req.body.name;
    if (!album) {
        return res.status(500).json({
            message: 'album name not present'
        });
    }
    connection.db.documents.query(
        connection.qb.where(connection.qb.collection(album))
    ).result().then(function (documents) {
        if (documents.length > 0) {
            connection.db.removeCollection(album);
            res.status(200).json({
                message: 'Collection removed successfully'
            });
        } else {
            res.status(500).json({
                message: 'Collection not present in DB'
            });
        }
    });
};
