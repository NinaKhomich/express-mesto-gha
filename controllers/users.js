const User = require('../models/user');
const ERROR_CODE = require('../utils/constants');

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
      }
      res.send(user);
    })
    .catch(() => {
      res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении пользователя',
          });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      } else {
        res
          .status(ERROR_CODE.SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
};
