const router = require('express').Router();
const {
  getUsers,
  getUserId,
  createUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/users/me/avatar', updateAvatar);
router.patch('/users/me', updateProfile);

module.exports = router;
