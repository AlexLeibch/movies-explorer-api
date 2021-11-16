const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, login, updateMe, getMe,
} = require('../controllers/users');

usersRouter.get('/users/me', getMe);
usersRouter.put('/users/me', celebrate({
  body: Joi.string().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
  updateMe,
}));

module.exports = usersRouter;
