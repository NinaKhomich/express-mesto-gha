const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const routes = require('./routes');
const errorProcessing = require('./middlewares/error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

mongoose.connect(DB_URL);

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use(routes);
app.use(errors());
app.use(errorProcessing);

app.listen(PORT, () => {
  console.log('сервер запущен');
});
