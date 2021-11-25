/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErr');
const BadRequestError = require('../errors/badRequestErr');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      res.send(user);
    })
    .catch(next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Данные пользователя не найдены'));
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existedUser) => {
      if (existedUser) {
        throw new BadRequestError('Пользователь с таким email уже существует');
      }

      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          });
        })

        .then((user) => {
          res.status(200).send(user);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((existedUser) => {
      const token = jwt.sign(
        { _id: existedUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );

      User.findOne({ email }).then((user) => {
        res
          .cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600 * 24 * 7,
          })
          .send(user);
      });
    })
    .catch(next);
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Переданы некорректные данные');
      }

      res.send(user);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Переданы некорректные данные');
      }

      res.send(user);
    })
    .catch(next);
};
