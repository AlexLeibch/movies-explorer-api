const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateMe, getMe,
} = require('../controllers/users');

usersRouter.get('/users/me', getMe);
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateMe);

module.exports = usersRouter;
