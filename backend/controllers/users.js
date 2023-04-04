const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');
const { ConflictError } = require('../utils/errors/conflict');
const { UnauthorizedError } = require('../utils/errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

// Create user:
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }

      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }

      next(new InternalError('Произошла ошибка cервера'));
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
        .send({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        })
        .end();
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(new UnauthorizedError('Неверный логин или пароль'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

// Logout
const logout = (req, res, next) => {
  res.clearCookie('jwt');
  next(new InternalError('Произошла ошибка cервера'));
};

// Get current user:
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      // Check if user exist:
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => {
      next(new InternalError('Произошла ошибка cервера'));
    });
};

// Get user by ID:
const getUserById = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      // Check if user exist:
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

// Get users:
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => next(new InternalError('Произошла ошибка cервера')));
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
        next(new BadRequestError('Переданы некорректные данные при редактировании пользователя'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
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
        next(new BadRequestError('Переданы некорректные данные при создании аватара'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
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
