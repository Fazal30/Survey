/* eslint-disable no-restricted-syntax */

/**
 * This will export a helper function (route) which will abstract
 * some functionalities of the controller.
 */

const { validationResult } = require('express-validator');
const createError = require('http-errors');

const { mCache, genCacheKey } = require('../utils/cache');
const logger = require('../utils/logger');

const VALIDATION_ERROR = 'Validation error.';

/**
 * Convert errors array to object.
 * @param {Array} errors
 */
const convertErrorToObject = (errors) => {
  const fieldErrors = {};
  for (const error of errors) {
    if (error.param && !fieldErrors[error.param])
      fieldErrors[error.param] = error.msg;
  }
  return fieldErrors;
};

/**
 * Extract inputs from the request object.
 *
 * It will return all the fields if `fields` parameter is not specified
 * or is empty.
 *
 * And if `fields` parameter is specified it will return the fields mentioned
 * in it.
 *
 * @param {Object} req The request object from express
 * @param {Array} fields The fields which needs to be extracted
 */
const getInputs = (req, fields) => {
  const inputsObj = {};
  if (fields && fields.length > 0) {
    for (const key of fields) {
      if (req.body[key] !== undefined) {
        const value = req.body[key];
        if (typeof value === 'string') inputsObj[key] = value.trim();
        else inputsObj[key] = value;
      }
    }
  } else
    for (const key of Object.keys(req.body)) inputsObj[key] = req.body[key];
  return inputsObj;
};

/**
 * It returns the validation errors.
 *
 * @param {Object} req The request object from express
 * @param {Boolean} asObject If it's value is true an Object type error
 * is returned otherwise an array type error is returned
 */
const getValidationError = (req) => {
  const errors = validationResult(req).array();
  return convertErrorToObject(errors);
};

/**
 * Create a middleware for validation check with the options specified
 * @param {Object} options Options to be specified
 * @param {String} options.errorMsg The error message that should be returned.
 * @param {Boolean} options.throwError Specifies if the middleware should throw
 * error or not. If set to false it will store the errors in req.validationError.
 * @param {Boolean} options.asObject If the error returned should be an object
 */
const createValidationMiddleware = ({ errorMsg, throwError }) => {
  return async (req, res, next) => {
    const errors = getValidationError(req);
    if (Object.keys(errors).length > 0) {
      if (throwError) {
        next(createError(400, { errors, code: 400 }, errorMsg));
        return;
      }
      res.locals.errors = errors;
    }

    next();
  };
};

/**
 * Create a middleware for pagination
 */
const createPaginationMiddleware = ({
  defaultItemsPerPage,
  defaultSort,
  defaultOrder,
  allowedFilters = [],
  allowedSort = [],
}) => {
  return async (req, res, next) => {
    let _defaultSort = defaultSort;
    let _defaultOrder = defaultOrder;

    if (!_defaultSort) _defaultSort = 'createdAt';

    if (!_defaultOrder) _defaultOrder = 'd';

    let {
      page = 1,
      itemsPerPage = defaultItemsPerPage,
      sort = _defaultSort,
      order = _defaultOrder,
    } = req.query;

    page = parseInt(page, 10);
    itemsPerPage = parseInt(itemsPerPage, 10);

    const sortObj = [];
    const filterObj = {};
    if (!allowedSort.includes(sort)) {
      sort = _defaultSort;
    }

    if (!['a', 'd'].includes(order)) {
      order = _defaultOrder;
    }

    sortObj.push([sort, order === 'a' ? 'ASC' : 'DESC']);

    if (allowedFilters && allowedFilters.length > 0) {
      for (const key of allowedFilters) {
        if (Array.isArray(key)) {
          if (key.length === 2 && req.query[key[0]] !== undefined) {
            let allowedStrings = [];
            if (Array.isArray(key[1])) {
              // eslint-disable-next-line prefer-destructuring
              allowedStrings = key[1];
            } else {
              allowedStrings.push(key[1]);
            }

            if (allowedStrings.includes(req.query[key[0]])) {
              filterObj[key[0]] = req.query[key[0]];
            }
          }
        } else if (req.query[key] !== undefined)
          filterObj[key] = req.query[key];
      }
    }

    res.locals.pagination = {
      page,
      itemsPerPage,
      order: sortObj,
      where: filterObj,
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    };
    next();
  };
};

const createCacheMiddleware = (key, dependsOnUser) => {
  return async (req, res, next) => {
    try {
      const { hardRefresh } = req.query;

      const cacheKey = genCacheKey({
        userId: dependsOnUser ? req.user.id : undefined,
        key,
        path: req.originalUrl,
      });
      res.locals.cacheKey = cacheKey;
      const cacheContent = mCache.get(cacheKey);
      if (!cacheContent || hardRefresh) {
        return next();
      }
      return res.json(cacheContent);
    } catch (error) {
      logger.error(error);
      return next();
    }
  };
};

/**
 * This will create a series of middleware functions to execute common tasks
 * based on the options provided.
 *
 * @param {*} cb A middleware which is to be executed
 * @param {Object} options Options
 * @param {Object} options.validation Validation Object
 * @param {Array} options.validation.validators Validators array
 * @param {String} options.validation.errorMsg Error message if validation failed
 * @param {Boolean} options.validation.throwError If true throws error if validation fails
 * @param {Boolean|Array} options.inputs If true returns inputs in `res.locals.inputBody`. One can also provide an array with required fields
 */
const route = (
  controller,
  options = {
    validation: {
      validators: [],
      errorMsg: VALIDATION_ERROR,
      throwError: false,
    },
    inputs: false,
    pagination: {
      defaultItemsPerPage: undefined,
      defaultSort: 'createdAt',
      defaultOrder: 'a',
      allowedFilters: [],
      allowedSort: [],
    },
    cache: undefined,
  },
) => {
  const middlewareArray = [];

  if (options.cache) {
    middlewareArray.push(
      createCacheMiddleware(options.cache.key, options.cache.dependsOnUser),
    );
  }

  const customController = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  if (options.inputs) {
    let fields = [];
    if (Array.isArray(options.inputs)) fields = options.inputs;

    middlewareArray.push((req, res, next) => {
      const inputs = getInputs(req, fields);
      if (res.locals.inputBody) {
        res.locals.inputBody = { ...res.locals.inputBody, ...inputs };
      } else {
        res.locals.inputBody = inputs;
      }
      next();
    });
  }

  if (options.validation) {
    middlewareArray.push(options.validation.validators);
    middlewareArray.push(
      createValidationMiddleware({
        throwError: options.validation.throwError,
        errorMsg: options.validation.errorMsg || VALIDATION_ERROR,
      }),
    );
  }

  if (options.pagination && options.pagination.defaultItemsPerPage) {
    middlewareArray.push(createPaginationMiddleware(options.pagination));
  }

  middlewareArray.push(customController);
  return middlewareArray;
};

module.exports = route;
