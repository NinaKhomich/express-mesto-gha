const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const { SUCCESS_CODE } = require('../utils/constants');

const Card = require('../models/card');

const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequest = require('../utils/errors/BadRequest');
const Forbidden = require('../utils/errors/Forbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS_CODE.CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Нельзя удалять чужие карточки');
      }
      Card.deleteOne(card)
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else next(err);
    });
};

const cardToUpdate = (body, req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    body,
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else next(err);
    });
};

const putLike = (req, res, next) => {
  cardToUpdate({ $addToSet: { likes: req.user._id } }, req, res, next);
  // добавить _id в массив, если его там нет
};

const deleteLike = (req, res, next) => {
  cardToUpdate({ $pull: { likes: req.user._id } }, req, res, next); // убрать _id из массива
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
