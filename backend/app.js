require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errors-handler');

// creating app
const app = express();

// listening port 3000
const { PORT = 3000 } = process.env;

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://mesto-service.nomoredomains.work',
  ],
  credentials: true,
  maxAge: 60,
}));

// connecting to the Mongo server
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(express.json());

app.use(requestLogger);

// Routes of index page:
app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // If everything is ok, console will return the listening app port:
  console.log(`App listening on port ${PORT}`);
});
