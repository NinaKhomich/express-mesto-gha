const routes = require('express').Router();

const NotFoundError = require('../utils/errors/NotFoundError');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserLogin, validateUserRegist } = require('../middlewares/validation');

routes.post('/signup', validateUserRegist, createUser);
routes.post('/signin', validateUserLogin, login);

routes.use(auth);
routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

routes.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = routes;
