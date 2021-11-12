const Card = require("../models/card");
const ValidationError = require("../errors/validationError");
const NotFoundError = require("../errors/notFoundErr");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new ValidationError("Переданы некорректные данные");
      }

      return res.send(card);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};
module.exports.removeCard = (req, res, next) => {
  Card.findById(req.user._id)
    .then((foundedCard) => {
      if (!foundedCard) {
        throw new NotFoundError("Карточка не найдена");
      }

      Card.deleteOne({ _id: req.params.id }).then((removedCard) =>
        res.send(removedCard)
      );
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }

      return res.send(card);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }

      return res.send(card);
    })
    .catch(next);
};
