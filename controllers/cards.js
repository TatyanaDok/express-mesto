/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundErr');
const BadRequestError = require('../errors/badRequestErr');
const ForbiddenError = require('../errors/forbiddenErr');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      }

      return res.send(card);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.user._id)
    .then((foundedCard) => {
      if (!foundedCard) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (JSON.stringify(foundedCard.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError('Нет прав для совершения данной операции');
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
        throw new NotFoundError('Карточка не найдена');
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
        throw new NotFoundError('Карточка не найдена');
      }

      return res.send(card);
    })
    .catch(next);
};
