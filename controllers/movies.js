const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden');

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
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('У пользователя нет фильма с таким id'));
      } else if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne({ _id: movie._id })
          .then(() => {
            res.status(200).send({ message: 'фильм удалён' });
          });
      } else {
        next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Данные не прошли валидацию');
      }
      next(err);
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports = { createMovie, deleteMovie, getMovies };
