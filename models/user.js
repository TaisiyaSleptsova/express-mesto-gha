const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальное количество символов должно быть - 2'],
    maxlength: [30, 'Максимальное количество символов не должно превышать - 30'],
    required: [true, 'Поле должно быть заполнено'],
  },
  about: {
    type: String,
    minlength: [2, 'Минимальное количество символов должно быть - 2'],
    maxlength: [30, 'Максимальное количество символов не должно превышать - 30'],
    required: [true, 'Поле должно быть заполнено'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
