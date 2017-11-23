var ml = require('marklogic');

module.exports = {
  username: 'admin',
  pass: 'admin',
  db: ml.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    database: process.env.NODE_ENV == 'test' ? 'test_songs' : 'songs',
    user: 'admin',
    password: 'admin'
  }),
  qb: ml.queryBuilder
};