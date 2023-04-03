const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');
const { ConflictError } = require('../utils/errors/conflict');
const { UnauthorizedError } = require('../utils/errors/unauthorized');

// Creating errors:
const internalError = new InternalError();
const createBadRequestError = new BadRequestError('Переданы некорректные данные при создании пользователя');
const findBadRequestError = new BadRequestError('Переданы некорректные данные при поиске пользователя');
const userNotFoundError = new NotFoundError('Пользователь по указанному _id не найден');
const emailConflictError = new ConflictError('Пользователь с таким email уже существует');
const unauthorizedError = new UnauthorizedError('Неверный логин или пароль');

const { NODE_ENV, JWT_SECRET } = process.env;

// Create user:
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  console.log(req.body);

  console.log(req.body);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createBadRequestError);
        return;
      }

      if (err.code === 11000) {
        next(emailConflictError);
        return;
      }

      next(internalError);
    });
};

// Login:
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate token:
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000,
          sameSite: true,
        })
        .send(user)
        .end();
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(unauthorizedError);
        return;
      }
      next(internalError);
    });
};

// Logout
const logout = (req, res, next) => {
  const { userId } = req.body;

  User.findById(userId)
    .then(() => {
      res
        .clearCookie('jwt')
        .end();
    })
    .catch(() => next(internalError));
};

// Get current user:
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      // Check if user exist:
      if (!user) {
        next(userNotFoundError);
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => {
      next(internalError);
    });
};

// Get user by ID:
const getUserById = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      // Check if user exist:
      if (!user) {
        next(userNotFoundError);
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(findBadRequestError);
        return;
      }
      next(internalError);
    });
};

// Get users:
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => next(internalError));
};

// Update user info:
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createBadRequestError);
        return;
      }
      next(internalError);
    });
};

// Update user avatar:
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createBadRequestError);
        return;
      }
      next(internalError);
    });
};

module.exports = {
  createUser,
  login,
  logout,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
};
