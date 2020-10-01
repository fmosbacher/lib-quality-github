const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { indexRoute, issuesRoutes } = require('./routes');

const app = express();
dotenv.config();

// App configs
app.set('port', process.env.PORT);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoute);
app.use('/issues', issuesRoutes);

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});
