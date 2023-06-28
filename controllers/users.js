const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const { ERROR_CODE, SUCCESS_CODE } = require('../utils/constants');

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные при поиске пользователя',
          });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESS_CODE.CREATED).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const userToUpdate = (body, req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    body,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении данных пользователя',
          });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  userToUpdate({ name, about }, req, res);
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  userToUpdate({ avatar }, req, res);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
};
