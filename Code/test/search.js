process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var connection = require('../public/javascripts/connection.js');
var loaded = false;
chai.use(chaiHttp);

//Get album should return all songs in album if album collection is present
describe('/GET album', () => {
    it('it should return all songs under given album', (done) => {
        chai.request(server)
            .get('/v1/album?name=War')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.be.lengthOf(6);
                done();
            });
    });
});

//Get album should return null when album is not in collection
describe('/GET album', () => {
    it('it should return error if album is not present is DB', (done) => {
        chai.request(server)
            .get('/v1/album?name=dummy')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });
    });
});

//Get album should send error when album name is not specified
describe('/GET album', () => {
    it('it should return error if album is not specified', (done) => {
        chai.request(server)
            .get('/v1/album')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.have.property('message');
                if (res.body.message.indexOf('album name empty or null' == 0))
                    done();
                should.fail('wrong message');
            });
    });
});

//Get song should return all matches in DB
describe('/GET song', () => {
    it('it should return all matches in DB', (done) => {
        chai.request(server)
            .get('/v1/song?name=First')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.be.lengthOf(1);
                done();
            });
    });
});

//Get song should return null when song is not in collection
describe('/GET song', () => {
    it('it should return error if song is not present is DB', (done) => {
        chai.request(server)
            .get('/v1/song?name=sdfdsfsdfd')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });
    });
});

//Get song should send error when song name is not specified
describe('/GET song', () => {
    it('it should return error if song is not specified', (done) => {
        chai.request(server)
            .get('/v1/song')
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.have.property('message');
                if (res.body.message.indexOf('song name empty or null' == 0))
                    done();
                should.fail('wrong message');
            });
    });
});