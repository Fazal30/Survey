const createError = require('http-errors');
const {
  Form,
  FormQuestion,
  FormResponse,
  FormQuestionResponse,
  PrimitiveType,
} = require('../../../models');
const create = require('../../create');
const validators = require('../../../validators/survey');
const { validateResponse } = require('../../../utils/primitiveTypes');

module.exports = {
  get: create(
    async (req, res) => {
      const { formId } = req.params;

      const form = await Form.findOne({
        where: { id: formId, isActive: true },
        attributes: Form.getDisplayFields(),
      });

      if (!form) {
        throw createError(404, 'This form does not exist.', {
          errors: {
            formId: 'This form does not exist.',
          },
        });
      }

      const questions = await FormQuestion.findAll({
        where: { formId },
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: PrimitiveType,
            as: 'type',
            attributes: PrimitiveType.getDisplayFields(),
          },
        ],
        attributes: FormQuestion.getDisplayFields(),
      });

      return res.json({
        form,
        questions,
      });
    },
    {
      validation: {
        validators: validators.get,
        throwError: true,
      },
    },
  ),

  addResponse: create(
    async (req, res) => {
      const { formId } = req.params;
      const { inputBody } = res.locals;

      const form = await Form.findOne({
        where: { id: formId, isActive: true },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'This form does not exist.', {
          errors: {
            formId: 'This form does not exist.',
          },
        });
      }

      const questions = await FormQuestion.findAll({
        where: { formId },
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: PrimitiveType,
            as: 'type',
            attributes: ['id', 'type'],
          },
        ],
        attributes: ['id', 'isRequired'],
      });

      const { validValues, errors } = validateResponse(
        questions,
        inputBody.response,
      );

      if (errors) {
        throw createError(400, 'Validation Error.', {
          errors,
        });
      }

      const formResponse = await FormResponse.create({ formId });

      const formQuestionResponses = await FormQuestionResponse.bulkCreate(
        validValues.map((val) => ({ ...val, responseId: formResponse.id })),
      );

      return res.json({
        message: 'Response added successfully.',
        response: formQuestionResponses,
      });
    },
    {
      validation: {
        validators: validators.addResponse,
        throwError: true,
      },
      inputs: ['response'],
    },
  ),
};
