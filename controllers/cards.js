const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ERROR_CODE = 400;

  Card.create({ name, link })
    .then((card) => {
      res.send({ card });
    })
    .catch(() =>
      res
        .status(ERROR_CODE)
        .send({ message: "Произошла ошибка, не удалось создать карточку" })
    );
};

module.exports.getCards = (req, res) => {
  const ERROR_CODE = 404;

  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() =>
      res
        .status(ERROR_CODE)
        .send({ message: "Произошла ошибка, не удалось найти карточки" })
    );
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
      } else {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: "Карточка не найдена" });
      }
    })
    .catch(() => {
      const ERROR_CODE = 400;
      return res.status(ERROR_CODE).send({ message: "Неверный id карточки" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      const ERROR_CODE = 404;
      res.status(ERROR_CODE).send({ message: "Карточка не найдена" });
    })
    .catch(() => {
      const ERROR_CODE = 400;
      return res.status(ERROR_CODE).send({ message: "Неверный id карточки" });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: "Карточка не найдена" });
      }
    })
    .catch(() => {
      const ERROR_CODE = 400;
      return res.status(ERROR_CODE).send({ message: "Неверный id карточки" });
    });
};
