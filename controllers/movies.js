const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    nameRU,
    // movieId
    nameEN,
  }).then((movie) => {
    res.status(200).send({ data: movie });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      throw new BadRequestError('Неверные данные');
    }
  }).catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove({ owner: req.user._id, _id: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw NotFoundError('У пользователя нет фильма с таким id');
      }
      return res.status(200).send({ message: 'Фильм удалён' });
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Неверные данные');
      }
      throw err;
    }).catch(next);
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports = { createMovie, deleteMovie, getMovies };
