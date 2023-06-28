const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const { ERROR_CODE, SUCCESS_CODE } = require('../utils/constants');

const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS_CODE.CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для удаления карточки',
          });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для постановки лайка',
          });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
