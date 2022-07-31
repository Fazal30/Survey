const baseValidators = {
  string: (name, body, { displayName, isOptional }) => {
    if (isOptional)
      return body(name)
        .isString()
        .withMessage(`${displayName} should be a string.`)
        .optional();

    return body(name)
      .notEmpty()
      .withMessage(`${displayName} is required.`)
      .isString()
      .withMessage(`${displayName} should be a string.`);
  },
  name: (name, body) => {
    return body(name)
      .isString()
      .notEmpty()
      .withMessage('Please enter your name.');
  },
  email: (name, body) => {
    return body(name)
      .isString()
      .notEmpty()
      .withMessage('Please enter your email.')
      .isEmail()
      .withMessage('Please enter a valid email.');
  },
  password: (name, body) => {
    return body(name)
      .isString()
      .notEmpty()
      .withMessage('Please enter a password.')
      .isLength({ min: 8 })
      .withMessage('Password should be of atleast 8 characters.');
  },

  id: (name, body, { errorMsg, isOptional }) => {
    const validator = body(name)
      .isUUID(4)
      .withMessage(errorMsg || 'Please enter a valid id.');

    if (isOptional) validator.optional();

    return validator;
  },

  bool: (name, body, { errorMsg, displayName, isOptional }) => {
    const validator = body(name)
      .isBoolean()
      .withMessage(
        errorMsg || `${displayName} must be either 'true' or 'false'.`,
      );

    if (isOptional) validator.optional();

    return validator;
  },

  response: (name, body) => {
    return body(name)
      .not()
      .isEmpty()
      .withMessage('Response is required.')
      .custom((value) => {
        if (
          value === null ||
          Array.isArray(value) ||
          typeof value !== 'object'
        ) {
          throw new Error('Response should be an object.');
        }

        return true;
      });
  },
};

module.exports = baseValidators;
