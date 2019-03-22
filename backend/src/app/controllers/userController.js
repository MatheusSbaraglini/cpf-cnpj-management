// const express = require('express');
// const Person = require('../models/personModel');
// const Corporation = require('../models/corporationModel');
// const userFactory = require('../utils/userFactory');
const User = require('../models/userModel');
const { InvalidCpfError, InvalidCnpjError, DomainError } = require('../errors');
const validateCpfCnpj = require('../utils/userHelper').validateCpfCnpj;

// const router = express.Router();

module.exports.index = async function (req, res) {
    try {
        const users = await User.find();

        return res.send({ 
            message: "Sucesso.",
            users
        })
    } catch (err) {
        // console.error(err);
        res.status(400).json({ error: 'Falha ao carregar usuários.' });
    }
};

module.exports.view = async function (req, res) {
    try {
        const userId = req.params.user_id;

        const user = await User.findById(userId);

        return res.send({ 
            message: "Sucesso.",
            user
        });
    } catch (err) {
        // console.error(err);
        return res.send(400).send({ error: 'Falha ao carregar usuário.' + err })
    }
};

module.exports.new = async function (req, res) {
    try {
        const { name, cpf, cnpj, active } = req.body;

        validateCpfCnpj(cpf, cnpj);

        const user = await User.findOne({cpf, cnpj});

        if (user)
            throw new DomainError('CPF/CNPJ já existe.');

        const newUser = new User({ name, cpf, cnpj, active});

        await newUser.save();

        return res.status(201).send({ 
            message: "Usuário criado com sucesso.",
            user: newUser
        });
    } catch (err) {
        // console.log('error posting user: ' + err);
        if (err instanceof InvalidCpfError || err instanceof InvalidCnpjError || err instanceof  DomainError) {
            return res.status(400).json({ error: err.message });
        } else {
            return res.status(400).json({ error: 'Falha ao criar novo usuário.' });
        };
    };
};

module.exports.update = async function (req, res) {
    try {
        let { name, cpf, cnpj, active } = req.body;

        const userId = req.params.user_id;

        let user = await User.findById(userId);

        user.name = name ? name : user.name;

        if (cpf) {
            user.cpf = cpf;
            user.cnpj = undefined;
        } else if (cnpj) {
            user.cnpj = cnpj;
            user.cpf = undefined;
        };

        validateCpfCnpj(user.cpf, user.cnpj);

        if (typeof active !== 'undefined' && active !== null) {
            user.active = active
        };

        await user.save();

        return res.send({ 
            message: "Usuário alterado com sucesso.",
            user 
        });
    } catch (err) {
        // console.log(err);
        if (err instanceof InvalidCpfError || err instanceof InvalidCnpjError || err instanceof  DomainError) {
            return res.status(400).send({ error: err.message });
        } else {
            return res.status(400).send({ error: 'Falha ao alterar usuário!' });
        };
    }
};

module.exports.delete = async function (req, res) {
    try {
        const userId = req.params.user_id;

        await User.deleteOne({ _id: userId });

        return res.status(200).send({ message: "Usuário removido com sucesso." });
    } catch (err) {
        // console.log(err);
        return res.status(400).send({ error: 'Falha ao remover usuário.' });    
    }
};