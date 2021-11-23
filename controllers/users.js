const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadAuthError = require('../errors/bad-auth-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMe = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.status(200).send({ data: user });
  })
  .catch(next);

const updateMe = (req, res, next) => {
  const { name, mail } = req.body;
  const owner = req.user._id;

  return User.findByIdAndUpdate(owner, { name, mail }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredential(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      throw new BadAuthError(err.message);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    })).then((user) => res.status(200).send({ mail: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Неверно указаны данные');
      }
      throw new ConflictError('Такая почта уже зарегестрирована');
    })
    .catch(next);
};

module.exports = {
  createUser, login, updateMe, getMe,
};
