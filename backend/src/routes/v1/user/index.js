const express = require('express');

const router = express.Router();
const controller = require('../../../controllers/v1/user/index');
const authenticator = require('../../../middlewares/authenticator');

router.get('/profile', authenticator(), controller.profile);

module.exports = router;
