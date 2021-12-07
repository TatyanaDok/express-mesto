/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badRequestErr');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErr');
const UnauthorizedError = require('../errors/unauthorizedErr');
const ConflictError = require('../errors/conflictError');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existedUser) => {
      if (existedUser) {
        throw new ConflictError('Пользователь с таким email уже существует');
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
        .then((createdUser) => {
          if (!createdUser) {
            throw new BadRequestError('Переданы некорректные данные');
          }

          User.findOne({ email }).then((user) => res.send(user));
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
            maxAge: 360000 * 24 * 7,
          })
          .send(user);
      });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      res.send(user);
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
        throw new UnauthorizedError('Переданы некорректные данные');
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
        throw new UnauthorizedError('Переданы некорректные данные');
      }

      res.send(user);
    })
    .catch(next);
};
module.exports.signout = (req, res) => {
  res
    .clearCookie('jwt', { httpOnly: true, sameSite: true })
    .send({ message: 'Signed Out' });
};
