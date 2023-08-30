const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточки с указанным id не существует'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Удаление карточек другого пользователя не возможно');
      } Card.deleteOne(card)
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('проверьте корректность указанного id'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточки с указанным id не существует'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('проверьте корректность указанного id'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Карточки с указанным id не существует'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('проверьте корректность указанного id'));
      } else {
        next(err);
      }
    });
};
