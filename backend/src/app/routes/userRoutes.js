const express = require('express');
const router = express.Router();

var userController = require('../controllers/userController');

router.route('/users/')
    .get(userController.all)
    .post(userController.new);

router.route('/users/:user_id')
    .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);

module.exports = router;