const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  const ERROR_CODE = 404;

  User.find({})
    .then((users) => res.send({ users }))
    .catch(() =>
      res
        .status(ERROR_CODE)
        .send({ message: "Произошла ошибка, не удалось найти пользователей" })
    );
};

module.exports.getUserId = (req, res) => {
  const ERROR_CODE = 404;

  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(ERROR_CODE).send({ message: "Нет пользователя с таким id" });
      }
    })
    .catch(() =>
      res.status(ERROR_CODE).send({ message: "Неверный id пользователя" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const ERROR_CODE = 400;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() =>
      res
        .status(ERROR_CODE)
        .send({ message: "Произошла ошибка, не удалось создать карточку" })
    );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const ERROR_CODE = 400;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(ERROR_CODE).send({ message: "Нет пользователя с таким id" });
      }
    })
    .catch(() =>
      res.status(ERROR_CODE).send({ message: "Переданы не корректные данные" })
    );
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const ERROR_CODE = 400;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(ERROR_CODE).send({ message: "Нет пользователя с таким id" });
      }
    })
    .catch(() =>
      res.status(ERROR_CODE).send({ message: "Переданы не корректные данные" })
    );
};
