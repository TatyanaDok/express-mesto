/* eslint-disable comma-dangle */
/* eslint-disable newline-per-chained-call */
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidation = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidation).required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().required().length(24).hex(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidation).required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateCard,
  validateId,
  validateUser,
  validateUserUpdate,
  validateAvatar,
  validateLogin,
};
