const movieRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

movieRouters.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+$/),
    trailer: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+$/),
    thumbnail: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+$/),
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
