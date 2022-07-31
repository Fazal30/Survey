const { body, param } = require('express-validator');
const { string, id, bool } = require('./index');

module.exports = {
  create: [
    string('title', body, { displayName: 'Title' }),
    string('description', body, {
      displayName: 'Description',
      isOptional: true,
    }),
  ],

  update: [
    id('id', param, { errorMsg: 'Invalid Form.' }),
    string('title', body, { displayName: 'Title' }),
    string('description', body, {
      displayName: 'Description',
      isOptional: true,
    }),
  ],

  delete: [id('id', param, { errorMsg: 'Invalid Form.' })],

  getById: [id('id', param, { errorMsg: 'Invalid Form.' })],

  addQuestion: [
    id('formId', param, { errorMsg: 'Invalid Form.' }),
    id('typeId', body, {
      errorMsg: 'Please select a valid type.',
      isOptional: true,
    }),
    string('question', body, { displayName: 'Question' }),
    string('hint', body, { displayName: 'Hint', isOptional: true }),
    bool('isRequired', body, { displayName: 'Is required', isOptional: true }),
  ],

  updateQuestion: [
    id('formId', param, { errorMsg: 'Invalid Form.' }),
    id('questionId', param, { errorMsg: 'Invalid Question.' }),
    id('typeId', body, {
      errorMsg: 'Please select a valid type.',
      isOptional: true,
    }),
    string('question', body, { displayName: 'Question' }),
    string('hint', body, { displayName: 'Hint', isOptional: true }),
    bool('isRequired', body, { displayName: 'Is required', isOptional: true }),
  ],

  deleteQuestion: [
    id('formId', param, { errorMsg: 'Invalid Form.' }),
    id('questionId', param, { errorMsg: 'Invalid Question.' }),
  ],

  getQuestions: [id('formId', param, { errorMsg: 'Invalid Form.' })],
  getResponses: [id('formId', param, { errorMsg: 'Invalid Form.' })],

  activateForm: [
    id('formId', param, { errorMsg: 'Invalid Form.' }),
    bool('active', body, { displayName: 'Activate' }),
  ],
};
