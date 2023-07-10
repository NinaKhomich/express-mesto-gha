const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { ValidationError, CastError } = mongoose.Error;

const User = require('../models/user');

const { SUCCESS_CODE } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequest = require('../utils/errors/BadRequest');
const ConflictError = require('../utils/errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (userId, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные при поиске пользователя'));
      } else next(err);
    });
};

const getUser = (req, res, next) => {
  getUserById(req.params.userId, res, next);
};

const getCurrentUser = (req, res, next) => {
  getUserById(req.user._id, res, next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          })
            .then((newUser) => {
              res.status(SUCCESS_CODE.CREATED).send(newUser);
            })
            .catch((err) => {
              if (err instanceof ValidationError) {
                next(new BadRequest('Переданы некорректные данные при создании пользователя'));
              }
            });
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true }).send({ token });
    })
    .catch(next);
};

const userToUpdate = (body, req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    body,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при редактировании данных пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userToUpdate({ name, about }, req, res, next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userToUpdate({ avatar }, req, res, next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
