require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const helmet = require('helmet');
const cors = require('cors');
const { Joi, celebrate, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const movieRouters = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(helmet());

mongoose.connect(DB_ADRESS);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  origin: [
    'http://localhost:3000',
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Email в некорректном формате');
    }),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use('/', usersRouter);
app.use('/', movieRouters);

app.use('*', (req, res, next) => {
  next(new Error('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? message : message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
