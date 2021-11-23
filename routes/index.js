const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const authRouter = require('./auth');

router.use(authRouter);

router.use(userRouter);
router.use(movieRouter);

router.use('*', (req, res, next) => {
  next(new Error('Страница не найдена'));
});

module.exports = router;
