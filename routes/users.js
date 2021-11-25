const router = require('express').Router();
const {
  getUserByIdValidation,
  updateUserInfoValidation,
  updateUserAvatarValidation,
} = require('../middlewares/celebrate');
const {
  getUsers,
  getUserId,
  getCurrentUserInfo,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

router.get('/userId', getUserByIdValidation, getUserId);
router.get('/', getUsers);
router.get('/users/me', getCurrentUserInfo);
router.patch('/me/avatar', updateUserAvatarValidation, updateAvatar);
router.patch('/me/profile', updateUserInfoValidation, updateProfile);

module.exports = router;
