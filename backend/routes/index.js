const router = require('express').Router();

const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { login, logout, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../utils/errors/not-found');

// Crash-test
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Sign-in:
router.post('/signin', celebrate({
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), login);

// Sign-out:
router.get('/logout', logout);

// Create user:
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/i),
  }),
}), createUser);

// Authorization middleware:
router.use(cookieParser()); // to get token from cookie
router.use(auth);

// Routes below are available only after authorization (!)

// Users:
router.use('/users', require('./users'));

// Cards
router.use('/cards', require('./cards'));

// Other routes:
router.all('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
