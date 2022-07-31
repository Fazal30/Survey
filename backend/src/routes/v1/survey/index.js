const express = require('express');

const router = express.Router();
const controller = require('../../../controllers/v1/survey/index');

router.get('/:formId', controller.get);
router.post('/:formId', controller.addResponse);

module.exports = router;
