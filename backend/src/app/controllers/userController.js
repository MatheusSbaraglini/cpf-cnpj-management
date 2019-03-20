// const express = require('express');
// const Person = require('../models/personModel');
// const Corporation = require('../models/corporationModel');
// const userFactory = require('../utils/userFactory');
const User = require('../models/userModel');
const { InvalidCpfError, InvalidCnpjError, DomainError } = require('../errors');
const { validarCpf, validarCnpj } = require('../utils/userHelper');

// const router = express.Router();

module.exports.index = async function (req, res) {
    try {
        const users = await User.find();

        return res.send({ 
            message: "Success",
            users
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'error loading users.' });
    }
};

module.exports.view = async function (req, res) {
    try {
        const userId = req.params.user_id;

        const user = await User.findById(userId);

        return res.send({ 
            message: "Success",
            user
        });
    } catch (err) {
        console.error(err);
        return res.send(400).send({ error: 'error loading user!' + err })
    }
};

module.exports.new = async function (req, res) {
    try {
        const { name, cpf, cnpj, active } = req.body;

        if (cpf) {
            if (!validarCpf(cpf))
                throw new InvalidCpfError('CPF is invalid!');
        } else if (cnpj) {
            if (!validarCnpj(cnpj))
                throw new InvalidCnpjError('CNPJ is invalid!');
        } else {
            throw new DomainError('CPF or CNPJ is required!');
        };

        const user = new User({ name, cpf, cnpj, active});

        await user.save();

        return res.status(201).send({ 
            message: "New user created",
            user 
        });
    } catch (err) {
        console.log('error posting user: ' + err);
        if (err instanceof InvalidCpfError || err instanceof InvalidCnpjError || err instanceof  DomainError) {
            return res.status(400).send({ error: err.message });
        } else {
            return res.status(400).send({ error: 'error creating a new user!' });
        };
    };
};

module.exports.update = async function (req, res) {
    try {
        let { name, cpf, cnpj, userType, active } = req.body;

        const userId = req.params.user_id;

        if (cpf) {
            if (!validarCpf(cpf))
                throw new InvalidCpfError('CPF is invalid!');
        } else if (cnpj) {
            if (!validarCnpj(cnpj))
                throw new InvalidCnpjError('CNPJ is invalid!');
        };

        let user = await User.findById(userId);

        user.name = name ? name : user.name;
        user.cpf = cpf ? cpf : user.cpf;
        user.cnpj = cnpj ? cnpj : user.cnpj;
        user.userType = userType ? userType  : user.userType;

        if (typeof active !== 'undefined' && active !== null) {
            user.active = active
        };

        await user.save();

        return res.send({ 
            message: "User updated",
            user 
        });
    } catch (err) {
        console.log(err);
        if (err instanceof InvalidCpfError || err instanceof InvalidCnpjError) {
            return res.status(400).send({ error: err.message });
        } else {
            return res.status(400).send({ error: 'error updating a new user!' });
        };
    }
};

module.exports.delete = async function (req, res) {
    try {
        const userId = req.params.user_id;

        await User.deleteOne({ _id: userId });

        return res.status(200).send({ message: "User deleted" });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'error removing a user!' });    
    }
};

// module.exports = app => app.use('/users', router);


// router.get('/', async (req, res) => {
//     try {
//         const people = await Person.find();
//         const corporations = await Corporation.find();

//         let users = {people, corporations};

//         return res.send({ users })
//     } catch (err) {
//         res.status(400).json({ error: 'error loading users.' + err });
//     }
// });

// router.get('/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;

//        console.log('get with resource, userID: ' + userId);

//         const person = await Person.findById(userId);
//         const corporation = await Corporation.findById(userId);

//         const user = person ? person : corporation;

//         return res.send({ user });
//     } catch (err) {
//         return res.send(400).send({ error: 'error loading user!' + err})
//     }
// });

// router.post('/', async (req, res) => {
//     try {
//         const { name, cpf, cnpj, userType } = req.body;

//         console.log('name: ' + name);
//         console.log('cpf: ' + cpf);
//         console.log('cnpj: ' + cnpj);
//         console.log('userType: ' + userType);

//         const User = userFactory.getInstance(userType);

//         const user = new User({ name, cpf, cnpj, userType });

//         await user.save();

//         return res.status(201).send({ user });
//     } catch (err) {
//         console.log('error posting user: ' + err);
//         if (err instanceof InvalidCpfError || err instanceof InvalidCnpjError) {
//             return res.status(400).send({ error: err.message });
//         } else {
//             return res.status(400).send({ error: 'error creating a new user!' });
//         }
//     }
// });

// router.put('/:userId', async (req, res) => {
//     try {
//         const { name, cpf, cnpj, userType } = req.body;

//         const User = userFactory.getInstance(userType);

//         const user = await User.findByIdAndUpdate(req.params.userId, {
//             name,
//             cpf,
//             cnpj,
//             userType
//         });

//         await user.save();

//         return res.send({ user });
//     } catch (err) {
//         return res.status(400).send({ error: 'error updating a user!' });
//     }
// });

// router.delete('/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         const person = await Person.findById(userId);
//         const corporation = await Corporation.findById(userId);

//         const user = person ? person : corporation;

//         const User = userFactory.getInstance(user.userType);
//         await User.deleteOne(user.userId);

//         return res.status(204).send({ });
//     } catch (err) {
//         return res.status(400).send({ error: 'error removing a user!' });    
//     }
// });

// module.exports = app => app.use('/users', router);
