const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserMe, getUserById, editUserAbout, editUserAvatar,
} = require('../controllers/users');
const urlAddress = require('../utils/constants');

router.get('/', getUsers);
router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserAbout);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlAddress),
  }),
}), editUserAvatar);

module.exports = router;
