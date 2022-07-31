const express = require('express');

const router = express.Router();
const controller = require('../../../controllers/v1/form/index');
const authenticator = require('../../../middlewares/authenticator');

router.post('/', authenticator(), controller.create);
router.get('/', authenticator(), controller.list);
router.post('/activate/:formId', authenticator(), controller.activateForm);
router.post('/question/:formId', authenticator(), controller.addQuestion);
router.patch('/question/:formId/:questionId', authenticator(), controller.updateQuestion);
router.delete('/question/:formId/:questionId', authenticator(), controller.deleteQuestion);
router.get('/question/:formId', authenticator(), controller.listQuestions);
router.get('/types', authenticator(), controller.listTypes);
router.get('/response/:formId', authenticator(), controller.getResponses);
router.get('/:id', authenticator(), controller.getById);
router.patch('/:id', authenticator(), controller.update);
router.delete('/:id', authenticator(), controller.delete);

module.exports = router;
