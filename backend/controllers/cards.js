const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');
const { ForbiddenError } = require('../utils/errors/forbidden');

// Creating errors:
const internalError = new InternalError('Произошла ошибка');
const createBadRequestError = new BadRequestError('Переданы некорректные данные при создании карточки');
const likeBadRequestError = new BadRequestError('Переданы некорректные данные для постановки / снятия лайка');
const findBadRequestError = new BadRequestError('Переданы некорректные данные при поиске карточки');
const notFoundError = new NotFoundError('Передан несуществующий _id карточки');
const cardForbiddenError = new ForbiddenError('Нет доступа к запрашиваемой карточке');

// Create card
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createBadRequestError);
        return;
      }
      next(internalError);
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
    .catch(() => next(internalError));
};

// Delete card
const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.id)
    .then((card) => {
      // Check if card exist:
      if (!card) {
        next(notFoundError);
        return;
      }
      // Check if user is owner of card:
      if (userId !== card.owner.toString()) {
        next(cardForbiddenError);
        return;
      }
      // If card exist and user it's owner - delete card:
      Card.findByIdAndRemove(req.params.id)
        .then((c) => {
          res.status(200).send(c);
        })
        .catch(() => next(internalError));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(findBadRequestError);
        return;
      }
      next(internalError);
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
        next(notFoundError);
        return;
      }
      // Return liked card to user:
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(likeBadRequestError);
        return;
      }
      next(internalError);
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
        next(notFoundError);
        return;
      }
      // Return disliked card to user:
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(likeBadRequestError);
        return;
      }
      next(internalError);
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
