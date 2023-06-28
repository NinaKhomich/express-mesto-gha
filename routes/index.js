const routes = require('express').Router();

const { ERROR_CODE } = require('../utils/constants');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

routes.use('/', (req, res) => {
  res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = routes;
