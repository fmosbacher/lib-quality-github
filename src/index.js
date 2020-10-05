const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const { saveHistory } = require('./jobs');
const { indexRoute, issuesRoutes, historyRoutes } = require('./routes');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Routes
app.use('/', indexRoute);
app.use('/issues', issuesRoutes);
app.use('/history', historyRoutes);

cron.schedule('0 0 * * *', saveHistory);

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
