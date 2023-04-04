const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');
const { ForbiddenError } = require('../utils/errors/forbidden');

// Create card
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

// Get cards
const getCards = (req, res, next) => {
  Card.find({})
    // Uncomment if will be required to get additional info:
    // .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => next(new InternalError('Произошла ошибка cервера')));
};

// Delete card
const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.id)
    .then((card) => {
      // Check if card exist:
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      // Check if user is owner of card:
      if (userId !== card.owner.toString()) {
        next(new ForbiddenError('Нет доступа к запрашиваемой карточке'));
        return;
      }
      // If card exist and user it's owner - delete card:
      card.deleteOne()
        .then(() => {
          res.status(200).send(card);
        })
        .catch(() => new InternalError('Произошла ошибка cервера'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

// Like card
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      // Check if card exist:
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      // Return liked card to user:
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

// Dislike card
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      // Check if card exist:
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      // Return disliked card to user:
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при снятии лайка'));
        return;
      }
      next(new InternalError('Произошла ошибка cервера'));
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
