const createError = require('http-errors');
const {
  Form,
  FormQuestion,
  FormQuestionResponse,
  FormResponse,
  PrimitiveType,
} = require('../../../models');
const create = require('../../create');
const validators = require('../../../validators/form');

module.exports = {
  create: create(
    async (req, res) => {
      const { inputBody } = res.locals;
      const form = await Form.create({ ...inputBody, userId: req.user.id });
      return res.json({ message: 'Form created successfully.', form });
    },
    {
      validation: {
        validators: validators.create,
        throwError: true,
      },
      inputs: ['title', 'description'],
    },
  ),

  update: create(
    async (req, res) => {
      const { id } = req.params;
      const { inputBody } = res.locals;

      const form = await Form.findOne({
        where: { userId: req.user.id, id },
        attributes: Form.getListFields(),
      });

      if (!form) {
        throw createError(404, 'Form does not exist.');
      }

      form.title = inputBody.title;
      form.description = inputBody.description;
      form.save();

      return res.json({ message: 'Form updated successfully.', form });
    },
    {
      validation: {
        validators: validators.update,
        throwError: true,
      },
      inputs: ['title', 'description'],
    },
  ),

  delete: create(
    async (req, res) => {
      const { id } = req.params;

      const form = await Form.findOne({
        where: { userId: req.user.id, id },
      });

      if (!form) {
        throw createError(404, 'Form does not exist.');
      }

      await FormQuestion.destroy({ where: { formId: form.id } });

      await form.destroy();

      return res.json({ message: 'Form deleted successfully.' });
    },
    {
      validation: {
        validators: validators.delete,
        throwError: true,
      },
      inputs: ['title', 'description'],
    },
  ),

  list: create(
    async (req, res) => {
      const { pagination } = res.locals;
      const { where, page, itemsPerPage, order, offset, limit } = pagination;

      where.userId = req.user.id;

      const forms = await Form.findAll({
        where,
        offset,
        limit,
        order,
        attributes: Form.getListFields(),
      });

      const totalItems = await Form.count({ where });
      const lastPage = Math.ceil(totalItems / itemsPerPage);

      return res.json({
        forms,
        totalItems,
        lastPage,
        itemsPerPage,
        page,
      });
    },
    {
      pagination: {
        defaultItemsPerPage: 10,
        allowedSort: ['createdAt', 'title'],
      },
    },
  ),

  getById: create(
    async (req, res) => {
      const { id } = req.params;

      const form = await Form.findOne({
        where: { userId: req.user.id, id },
        attributes: Form.getListFields(),
      });

      if (!form) {
        throw createError(404, 'Form does not exist.');
      }

      return res.json({
        form,
      });
    },
    {
      validation: {
        validators: validators.getById,
        throwError: true,
      },
    },
  ),

  listTypes: create(async (_req, res) => {
    const types = await PrimitiveType.findAll({
      order: [['createdAt', 'ASC']],
      attributes: PrimitiveType.getListFields(),
    });

    return res.json({
      types,
    });
  }),

  addQuestion: create(
    async (req, res) => {
      const { formId } = req.params;
      const { inputBody } = res.locals;

      const form = await Form.findOne({
        where: { id: formId, userId: req.user.id },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'The selected form does not exist.', {
          errors: {
            formId: 'The selected form does not exist.',
          },
        });
      }

      let type;

      if (inputBody.typeId) {
        type = await PrimitiveType.findOne({
          where: { id: inputBody.typeId },
          attributes: PrimitiveType.getDisplayFields(),
        });

        if (!type) {
          throw createError(404, 'The selected type does not exist.', {
            errors: {
              typeId: 'The selected type does not exist.',
            },
          });
        }
      } else {
        type = await PrimitiveType.findOne({
          where: { type: 'any' },
          attributes: PrimitiveType.getDisplayFields(),
        });
      }

      const question = await FormQuestion.create({
        ...inputBody,
        formId: form.id,
        typeId: type.id,
      });

      const questionData = question.dataValues;

      questionData.type = type.dataValues;

      return res.json({ question: questionData });
    },
    {
      validation: {
        validators: validators.addQuestion,
        throwError: true,
      },
      inputs: ['typeId', 'question', 'hint', 'isRequired'],
    },
  ),

  updateQuestion: create(
    async (req, res) => {
      const { formId, questionId } = req.params;
      const { inputBody } = res.locals;

      const form = await Form.findOne({
        where: { id: formId, userId: req.user.id },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'The selected form does not exist.', {
          errors: {
            formId: 'The selected form does not exist.',
          },
        });
      }

      let type;

      if (inputBody.typeId) {
        type = await PrimitiveType.findOne({
          where: { id: inputBody.typeId },
          attributes: PrimitiveType.getDisplayFields(),
        });

        if (!type) {
          throw createError(404, 'The selected type does not exist.', {
            errors: {
              typeId: 'The selected type does not exist.',
            },
          });
        }
      } else {
        type = await PrimitiveType.findOne({
          where: { type: 'any' },
          attributes: PrimitiveType.getDisplayFields(),
        });
      }

      const question = await FormQuestion.findOne({
        where: {
          formId: form.id,
          id: questionId,
        },
      });

      question.question = inputBody.question;
      question.hint = inputBody.hint;
      question.isRequired = inputBody.isRequired;
      question.typeId = inputBody.typeId;

      question.save();

      const questionData = question.dataValues;

      questionData.type = type.dataValues;

      return res.json({ question: questionData });
    },
    {
      validation: {
        validators: validators.updateQuestion,
        throwError: true,
      },
      inputs: ['typeId', 'question', 'hint', 'isRequired'],
    },
  ),

  deleteQuestion: create(
    async (req, res) => {
      const { formId, questionId } = req.params;

      const form = await Form.findOne({
        where: { id: formId, userId: req.user.id },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'The selected form does not exist.', {
          errors: {
            formId: 'The selected form does not exist.',
          },
        });
      }

      await FormQuestion.destroy({
        where: {
          formId: form.id,
          id: questionId,
        },
      });

      return res.json({ message: 'Question deleted successfully.' });
    },
    {
      validation: {
        validators: validators.deleteQuestion,
        throwError: true,
      },
    },
  ),

  listQuestions: create(
    async (req, res) => {
      const { formId } = req.params;

      const form = await Form.findOne({
        where: { id: formId, userId: req.user.id },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'The selected form does not exist.', {
          errors: {
            formId: 'The selected form does not exist.',
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
        attributes: FormQuestion.getListFields(),
      });

      return res.json({
        questions,
      });
    },
    {
      validation: {
        validators: validators.getQuestions,
        throwError: true,
      },
    },
  ),

  activateForm: create(
    async (req, res) => {
      const { formId } = req.params;
      const { inputBody } = res.locals;

      const form = await Form.findOne({
        where: { id: formId, userId: req.user.id },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'The selected form does not exist.', {
          errors: {
            formId: 'The selected form does not exist.',
          },
        });
      }

      await form.update({ isActive: inputBody.active });

      res.json({ message: 'Updated successfully.' });
    },
    {
      validation: {
        validators: validators.activateForm,
        throwError: true,
      },
      inputs: ['active'],
    },
  ),

  getResponses: create(
    async (req, res) => {
      const { formId } = req.params;
      const { pagination } = res.locals;
      const { where, page, itemsPerPage, order, offset, limit } = pagination;

      const form = await Form.findOne({
        where: { id: formId, userId: req.user.id },
        attributes: ['id'],
      });

      if (!form) {
        throw createError(404, 'The selected form does not exist.', {
          errors: {
            formId: 'The selected form does not exist.',
          },
        });
      }

      where.formId = form.id;

      const responses = await FormResponse.findAll({
        where,
        offset,
        limit,
        order,
        attributes: FormResponse.getListFields(),
        include: [
          {
            model: FormQuestionResponse,
            as: 'questions',
            attributes: FormQuestionResponse.getListFields(),
          },
        ],
      });

      const totalItems = await FormResponse.count({ where });
      const lastPage = Math.ceil(totalItems / itemsPerPage);

      return res.json({
        responses,
        totalItems,
        lastPage,
        itemsPerPage,
        page,
      });
    },
    {
      validation: {
        validators: validators.getResponses,
        throwError: true,
      },
      pagination: {
        defaultItemsPerPage: 10,
        allowedSort: ['createdAt'],
      },
    },
  ),
};
