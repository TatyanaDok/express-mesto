const router = require('express').Router();
const {
  createCardValidation,
  deleteCardValidation,
  changeCardLikeStatusValidation,
} = require('../middlewares/celebrate');

const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/cardId', deleteCardValidation, removeCard);
router.put('/likes', changeCardLikeStatusValidation, likeCard);
router.delete('/likes', changeCardLikeStatusValidation, dislikeCard);
module.exports = router;
