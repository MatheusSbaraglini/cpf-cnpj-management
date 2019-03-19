const express = require('express');
const router = express.Router();

var userController = require('../controllers/userController');

// User routes
router.route('/users/')
    .get(userController.index)
    .post(userController.new);

router.route('/users/:user_id')
    .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);

// Export userRoute
module.exports = router;