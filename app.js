const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// импортируем роутер пользователей
const users = require('./routes/users');
// импортируем роутер карточек
const cards = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '61910117b689aaacc6ed92e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/cards', cards);

app.use('/users', users);

app.use('*', (req, res) => {
  const ERROR_CODE = 404;
  res.status(ERROR_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
/* "body": {
  "name": "tututut",
  "link": "nbnbnbnb",
  "owner": "618d26e5ead8439f9dae4f85",
  "likes": [],
  "_id": "61910117b689aaacc6ed92e3",
  "createdAt": "2021-11-14T12:29:11.870Z",
  "__v": 0
} */
