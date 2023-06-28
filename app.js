const express = require('express');
const mongoose = require('mongoose');

const app = express();
const routes = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6499231b602764e79ed911ec',
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log('сервер запущен');
});
