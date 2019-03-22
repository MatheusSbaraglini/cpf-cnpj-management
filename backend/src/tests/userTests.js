const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../app/models/userModel');

const server = require('../index');

const should = chai.should();

chai.use(chaiHttp);

var newInvalidUserWithNoCpfCnpj = {
    name: 'Matheus'
};

// cpf users data
var newValidCpfUser = {
    name: 'Matheus Sbaraglini',
    cpf: '12517907048'
};

var newInvalidCpfUser = {
    name: 'Matheus Sbaraglini',
    cpf: '12312312300'
};

var newInvalidSameCpfUser = {
    name: 'Matheus Sbaraglini',
    cpf: '00000000000'
};


// cnpj users data
var newValidCnpjUser = {
    name: 'Matheus ltda.',
    cnpj: '07522880000105'
};

var newInvalidCnpjUser = {
    name: 'Matheus ltda.',
    cnpj: '12312312312300'
};

var newInvalidSameCnpjUser = {
    name: 'Matheus ltda.',
    cnpj: '00000000000000'
};


describe('API cpf-cnpj-management tests', function() {

    beforeEach(async function() {
        await User.deleteOne({});
    });

    // POST method tests
    describe('POST users tests', () => {
        it('it should POST a new cpf user', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newValidCpfUser)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name').equal('Matheus Sbaraglini');
                    res.body.user.should.have.property('cpf').equal('12517907048');
                    done();
                });
        });

        it('it should POST a new cnpj user', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newValidCnpjUser)
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
                .send(newInvalidCpfUser)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('CPF inválido.');
                    done();
                });
        });

        it('it should fail the POST because cpf is invalid with same numbers', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newInvalidSameCpfUser)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('CPF inválido.');
                    done();
                });
        })

        it('it should fail the POST because cnpj is invalid', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newInvalidCnpjUser)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('CNPJ inválido.');
                    done();
                });
        });

        it('it should fail the POST because cnpj is invalid with same numbers', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newInvalidSameCnpjUser)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('CNPJ inválido.');
                    done();
                });
        });

        it('it should fail the POST because neither cpf nor cnpj is declared', (done) => {
            chai.request(server)
                .post('/api/v1/users')
                .send(newInvalidUserWithNoCpfCnpj)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('error').equal('É necessário informar um CPF ou CNPJ');
                    done();
                });
        });
    });

    // GET method tests
    describe('GET users tests', () => {
        it('it should GET all users', (done) => {
            chai.request(server)
                .get('/api/v1/users')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('users');
                    res.body.should.have.property('message').equal('Sucesso.');
                    done();
                });

        });

        it('it should GET a cpf user', (done) => {
            let newUser = new User(newValidCpfUser);

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

        it('it should GET a cnpj user', (done) => {
            let newUser = new User(newValidCnpjUser);

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

    // PUT method tests
    describe('PUT users tests', () => {
        it('it should UPDATE a cpf user', (done) => {
            let newUser = new User(newValidCpfUser);

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

        it('it should UPDATE a cnpj user', (done) => {
            let newUser = new User(newValidCnpjUser);

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
            let newUser = new User(newValidCpfUser);

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(newInvalidCpfUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('error').equal('CPF inválido.');
                        done();
                    });
            });
        });

        it('it should fail the UPDATE because cpf is invalid with same numbers', (done) => {
            let newUser = new User(newValidCpfUser);

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(newInvalidSameCpfUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('error').equal('CPF inválido.');
                        done();
                    });
            });
        });

        it('it should fail the UPDATE because cnpj is invalid', (done) => {
            let newUser = new User(newValidCnpjUser);

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(newInvalidCnpjUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('error').equal('CNPJ inválido.');
                        done();
                    });
            });
        });

        it('it should fail the UPDATE because cnpj is invalid with same numbers', (done) => {
            let newUser = new User(newValidCnpjUser);

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(newInvalidSameCnpjUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('error').equal('CNPJ inválido.');
                        done();
                    });
            });
        });
    });

    // PATCH method tests
    describe('PATCH users tests', () => {
        it('it should deactive a cpf user with PATCH method', (done) => {
            let newUser = new User(newValidCpfUser);

            let deactiveUser = { active: false };

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(deactiveUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('_id').equal(user.id);
                        res.body.user.should.have.property('active').equal(false);
                        done();
                    });
            });
        });

        it('it should deactive a cnpj user with PATCH method', (done) => {
            let newUser = new User(newValidCnpjUser);

            let deactiveUser = { active: false };

            newUser.save((err, user) => {
                chai.request(server)
                    .put('/api/v1/users/' + user.id)
                    .send(deactiveUser)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('_id').equal(user.id);
                        res.body.user.should.have.property('active').equal(false);
                        done();
                    });
            });
        });
    });

    // DELETE method tests
    describe('DELETE users tests', () => {
        it('it should delete a cpf user', (done) => {
            let newUser = User(newValidCpfUser);

            newUser.save((err, user) => {
                chai.request(server)
                    .delete('/api/v1/users/' + user.id)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').equal('Usuário removido com sucesso.');
                        done();
                    });
            });
        });

        it('it should delete a cnpj user', (done) => {
            let newUser = User(newValidCnpjUser);

            newUser.save((err, user) => {
                chai.request(server)
                    .delete('/api/v1/users/' + user.id)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').equal('Usuário removido com sucesso.');
                        done();
                    });
            });
        });
    });
});