const movieRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

movieRouters.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isUrl(value)) {
        return value;
      }
      return helpers.message('Поле должно быть ссылкой');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isUrl(value)) {
        return value;
      }
      return helpers.message('Поле должно быть ссылкой');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isUrl(value)) {
        return value;
      }
      return helpers.message('Поле должно быть ссылкой');
    }),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRouters.get('/movies', getMovies);

movieRouters.delete('/movies/:movieId', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
}), deleteMovie);

module.exports = movieRouters;
