const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { indexRoute } = require('./routes');

const app = express();
dotenv.config();

app.set('port', process.env.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRoute);

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});
