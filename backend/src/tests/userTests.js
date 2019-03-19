const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../app/models/userModel');

const server = require('../index');

const should = chai.should();

chai.use(chaiHttp);

var newValidPerson = {
    name: 'Matheus Sbaraglini',
    cpf: '12517907048'
};

var newInvalidPerson = {
    name: 'Matheus Sbaraglini',
    cpf: '12312312300'
};

var newValidCorporation = {
    name: 'Matheus ltda.',
    cnpj: '07522880000105'
};

var newInvalidCorporation = {
    name: 'Matheus ltda.',
    cnpj: '12312312312300'
};

describe('API cpf-cnpj-management tests', function() {

    beforeEach(async function() {
        await User.deleteOne({});
    });

    describe('/POST users tests', () => {
        it('it should POST a new person user', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newValidPerson)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name').equal('Matheus Sbaraglini');
                    res.body.user.should.have.property('cpf').equal('12517907048');
                    done();
                });
        });

        it('it should POST a new corporation user', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newValidCorporation)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name').equal('Matheus ltda.');
                    res.body.user.should.have.property('cnpj').equal('07522880000105');
                    done();
                });
        });

        it('it should fail the POST because cpf is invalid', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newInvalidPerson)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('CPF is invalid!');
                    done();
                });
        });

        it('it should fail the POST because cnpj is invalid', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newInvalidCorporation)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('CNPJ is invalid!');
                    done();
                });
        });
    });

    describe('/GET users tests', () => {
        it('it should GET all users', (done) => {
            chai.request(server)
                .get('/api/v1/users')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('users');
                    res.body.should.have.property('message').equal('Success');
                    done();
                });

        });

        it('it should GET a person user', (done) => {
            let newUser = new User(newValidPerson);

            newUser.save((err, user) => {
                chai.request(server)
                    .get('/api/v1/users/' + user.id)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('_id').equal(user.id);
                        res.body.user.should.have.property('name').equal('Matheus Sbaraglini');
                        res.body.user.should.have.property('cpf').equal('12517907048');
                        done();
                    });
            });
        });

        it('it should GET a corporation user', (done) => {
            let newUser = new User(newValidCorporation);

            newUser.save((err, user) => {
                chai.request(server)
                    .get('/api/v1/users/' + user.id)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('_id').equal(user.id);
                        res.body.user.should.have.property('name').equal('Matheus ltda.');
                        res.body.user.should.have.property('cnpj').equal('07522880000105');
                        done();
                    });
            });
        });
    });

    describe('/PUT users tests', () => {
        it('it should UPDATE a person user', (done) => {
            let newUser = new User(newValidPerson);

            const updatedUser = {
                name: 'Other name',
                cpf: '81624853099'
            };

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(updatedUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('_id').equal(user.id);
                        res.body.user.should.have.property('name').equal('Other name');
                        res.body.user.should.have.property('cpf').equal('81624853099');
                        done();
                    });
            });
        });

        it('it should UPDATE a corporation user', (done) => {
            let newUser = new User(newValidCorporation);

            const updatedUser = {
                name: 'Other name ltda.',
                cnpj: '74596192000187'
            };

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(updatedUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('_id').equal(user.id);
                        res.body.user.should.have.property('name').equal('Other name ltda.');
                        res.body.user.should.have.property('cnpj').equal('74596192000187');
                        done();
                    });
            });
        });

        it('it should fail the UPDATE because cpf is invalid', (done) => {
            let newUser = new User(newValidPerson);

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(newInvalidPerson)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('error').equal('CPF is invalid!');
                        done();
                    });
            });
        });

        it('it should fail the UPDATE because cnpj is invalid', (done) => {
            let newUser = new User(newValidCorporation);

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(newInvalidCorporation)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('error').equal('CNPJ is invalid!');
                        done();
                    });
            });
        });
    });

    describe('/DELETE users tests', () => {
        it('it should delete a person user', (done) => {
            let newUser = User(newValidPerson);

            newUser.save((err, user) => {
                chai.request(server)
                    .delete('/api/v1/users/' + user.id)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').equal('User deleted');
                        done();
                    });
            });
        });

        it('it should delete a corporation user', (done) => {
            let newUser = User(newValidCorporation);

            newUser.save((err, user) => {
                chai.request(server)
                    .delete('/api/v1/users/' + user.id)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').equal('User deleted');
                        done();
                    });
            });
        });
    });
});