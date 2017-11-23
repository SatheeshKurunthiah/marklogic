process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var connection = require('../public/javascripts/connection.js');
var loaded = false;
chai.use(chaiHttp);

// Delete all files from DB
describe('delete all files in db', () => {
    it('empty the database', (done) => {
        connection.db.documents.removeAll({ directory: '/' }).result()
            .then(function (res) {
                done();
            });
    });
});

// Load all files to DB
describe('/GET load', () => {
    it('it should load all files in Data folder', (done) => {
        chai.request(server)
            .get('/v1/load')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

// Delete Pop album from DB
describe('/POST delete', () => {
    it('deleting pop album', (done) => {
        chai.request(server)
            .post('/v1/delete')
            .send({ name: 'Pop' })
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            });
    });
});

// Check if there is any document with 'Pop' as Album
describe('check if Pop album is deleted', () => {
    it('documets should be added to DB', (done) => {
        connection.db.documents.query(
            connection.qb.where(connection.qb.collection("Pop"))
        ).result().then(function (documents) {
            if (documents.length > 0) {
                res.should.have.status(200);
                should.fail('There is no documents in Pop album');
            } else {
                done();
            }
        });
    });
});

// Delete all files in the DB
describe('delete all files in db', () => {
    it('empty the database', (done) => {
        connection.db.documents.removeAll({ directory: '/' }).result()
            .then(function (res) {
                done();
            });
    });
});

// Return error when a album not in DB is send to delete
describe('/POST delete', () => {
    it('deleting pop album', (done) => {
        chai.request(server)
            .post('/v1/delete')
            .send({ name: 'Pop' })
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
});

// Load all files to DB
describe('/GET load', () => {
    it('it should load all files in Data folder', (done) => {
        chai.request(server)
            .get('/v1/load')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});