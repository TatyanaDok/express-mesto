/* eslint-disable comma-dangle */
/* eslint-disable newline-per-chained-call */
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/
    ),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(
        /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/
      )
      .required(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
      'any.required': 'Поле "name" должно быть заполнено',
    }),
    link: Joi.string()
      .pattern(
        /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/
      )
      .required(),
  }),
});

const deleteCardValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
});

const changeCardLikeStatusValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  getUserByIdValidation,
  updateUserInfoValidation,
  updateUserAvatarValidation,
  createCardValidation,
  deleteCardValidation,
  changeCardLikeStatusValidation,
};
