const SharkValidator = require('shark-validator/lib');

const primitiveTypes = [
  {
    name: 'any',
    description: 'Allows any value.',
    type: 'any',
  },
  {
    name: 'Number',
    description: 'Allows only numbers.',
    type: 'number',
  },
];

const validators = {
  any: (isRequired) => {
    const validator = [];

    if (isRequired) {
      validator.push(
        SharkValidator.isRequired({ message: 'This field is required.' }),
      );
    }

    validator.push(
      SharkValidator.isString({ message: 'This field should be a string.' }),
    );

    return validator;
  },

  number: (isRequired) => {
    const validator = [];

    if (isRequired) {
      validator.push(
        SharkValidator.isRequired({ message: 'This field is required.' }),
      );
    }

    validator.push(
      SharkValidator.isString({ message: 'This field should be a string.' }),
    );
    validator.push(
      SharkValidator.isNumber({ message: 'This field should be a number.' }),
    );

    return validator;
  },
};

const validateResponse = (questions, response) => {
  const responseValidatorObj = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const question of questions) {
    responseValidatorObj[question.id] = validators[question.type.type](
      question.isRequired,
    );
  }

  const validatorSchema = new SharkValidator.Validator(responseValidatorObj);
  const { values, errors } = validatorSchema.validate(response);
  const formattedErrors = {};

  if (!errors) {
    const validValues = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const key in values) {
      if (values[key])
        validValues.push({ questionId: key, response: values[key] });
    }

    return { validValues, errors };
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in errors) {
    if (key && errors[key] && errors[key].length > 0) {
      formattedErrors[key] = errors[key][0].error;
    }
  }

  return { validValues: null, errors: formattedErrors };
};

module.exports = { types: primitiveTypes, validateResponse };
