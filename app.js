const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// импортируем роутер пользователей
const users = require("./routes/users");
// импортируем роутер карточек
const cards = require("./routes/cards");
// Слушаем 3000 порт
const { PORT = 3000, BASE__PATH = "http://localhost:3000/" } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "618cd9ecebef9b0137c53c3a", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/cards", cards);

app.use("/users", users);

app.use("*", (req, res) => {
  const ERROR_CODE = 404;
  res.status(ERROR_CODE).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Link to the server ${BASE__PATH}`);
});