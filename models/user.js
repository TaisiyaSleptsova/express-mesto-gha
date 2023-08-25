const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');
const urlAddress = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальное количество символов должно быть - 2'],
    maxlength: [30, 'Максимальное количество символов не должно превышать - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальное количество символов должно быть - 2'],
    maxlength: [30, 'Максимальное количество символов не должно превышать - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return urlAddress.test(v);
      },
      message: 'Ссылка не корректна',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    unique: true,
    validate: {
      validator: function checkEmail(email) {
        return email && validator.isEmail(email);
      },
      message: 'Не корректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function checkLogin(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
        // return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
            // return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
