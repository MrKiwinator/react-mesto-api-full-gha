const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { login, logout, createUser } = require('./controllers/users');
const { NotFoundError } = require('./utils/errors/not-found');

const pageNotFoundError = new NotFoundError('Запрашиваемая страница не найдена');

// creating app
const app = express();

// listening port 3000
const { PORT = 3000 } = process.env;

// connecting to the Mongo server
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:3001',
    'https://http://mesto-service.nomoredomains.work',
  ],
  maxAge: 60,
}));

app.use(express.json());

app.use(cookieParser());

// Sign-in:
app.post('/signin', celebrate({
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), login);

// Sign-out:
app.post('/logout', logout);

// Create user:
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(({ scheme: ['http', 'https'] })),
  }),
}), createUser);

// Authorization middleware:
app.use(cookieParser()); // to get token from cookie
app.use(auth);

// Routes below are available only after authorization (!)

// Users:
app.use('/users', require('./routes/users'));

// Cards
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => next(pageNotFoundError));

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  // If everything is ok, console will return the listening app port:
  console.log(`App listening on port ${PORT}`);
});
