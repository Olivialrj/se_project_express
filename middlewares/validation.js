const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

module.exports.validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().optional(),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minmum length of the "password" field is 8',
    }),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().optional(),
  }),
});

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
    }),
    password: Joi.string().required().min(1).messages({
      "string.min": 'The minmum length of the "password" field is 1',
      "any.required": 'The "password" field is required',
    }),
  }),
});

module.exports.validateID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).messages({
      "string.length":
        "IDs must be a hexadecimal value length of 24 characters",
    }),
  }),
});
