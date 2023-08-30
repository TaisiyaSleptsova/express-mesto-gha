const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorServer = require('./middlewares/errorServer');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mynewtestdb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', require('./routes/index'));

app.use(errors());

app.use(errorServer);

app.listen(PORT, () => {
});
