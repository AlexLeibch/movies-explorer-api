const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, movieId,
    thumbnail, nameRU, nameEN,
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
    movieId,
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
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie || movie.owner.toString() !== req.user_id) {
        throw new NotFoundError('У пользователя нет фильма с таким id');
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then(() => {
          res.send({ message: 'фильм удалён' });
        }).catch(next);
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw BadRequestError('Данные не прошли валидацию');
      }
    }).catch(next);
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports = { createMovie, deleteMovie, getMovies };
