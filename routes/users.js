const router = require('express').Router();
const {
  getUsers, getUserById, createUser, editUserAbout, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', editUserAbout);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
