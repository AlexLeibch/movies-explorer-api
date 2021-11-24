require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { auth } = require('./middlewares/auth');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');

const { PORT = 3001, DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(limiter);
app.use(helmet());

mongoose.connect(DB_ADRESS);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  origin: [
    'http://localhost:3001',
    'http://api.alex.movies-explorer.nomoredomains.rocks',
    'https://api.alex.movies-explorer.nomoredomains.rocks',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(requestLogger);
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'произошла ошибка на сервере' : message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
