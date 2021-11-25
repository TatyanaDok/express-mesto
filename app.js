require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const {
  createUserValidation,
  loginValidation,
} = require('./middlewares/celebrate');
const NotFoundError = require('./errors/notFoundErr');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors());

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.get('*', () => {
  try {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  } catch (err) {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  }
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode, message } = err;

  if (statusCode) {
    return res.status(statusCode).send({ message });
  }

  return next();
});

app.use((req, res) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
