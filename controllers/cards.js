const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточки с указанным id не существует' });
          return;
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  } else {
    res.status(404).send({ message: 'id должен быть не менее 24 символов' });
  }
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточки с указанным id не существует' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  } else {
    res.status(404).send({ message: 'id должен быть не менее 24 символов' });
  }
};

module.exports.deleteLikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточки с указанным id не существует' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  } else {
    res.status(404).send({ message: 'id должен быть не менее 24 символов' });
  }
};
