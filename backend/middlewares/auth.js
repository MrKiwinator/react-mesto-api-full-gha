const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors/unauthorized');

const unauthorizedError = new UnauthorizedError('Ошибка авторизации');

module.exports = (req, res, next) => {
  // getting jwt from cookies:
  const token = req.cookies.jwt;

  if (!token) {
    next(unauthorizedError);
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, '83c00a96f2901e30ff4ae043acd0e4a9024aca3fd2cddd828b95bc4af003fed9');
  } catch (err) {
    next(unauthorizedError);
    return;
  }

  req.user = payload;

  next();
};
