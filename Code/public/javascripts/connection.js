var ml = require('marklogic');

module.exports = {
  username: 'satheesh',
  pass: 'satheeshm93',
  db: ml.createDatabaseClient({
    host: 'localhost',
    port: 8000,
    database: process.env.NODE_ENV == 'test' ? 'test_songs' : 'songs',
    user: 'satheesh',
    password: 'satheeshm93'
  }),
  qb: ml.queryBuilder
};