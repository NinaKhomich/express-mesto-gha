const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const app = express();
const routes = require('./routes');
const errorProcessing = require('./middlewares/error');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(routes);
app.use(errors());
app.use(errorProcessing);

app.listen(PORT, () => {
  console.log('сервер запущен');
});
