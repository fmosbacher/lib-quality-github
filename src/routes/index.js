const { Router } = require('express');
const issuesRoutes = require('./issues');

const indexRoute = Router();

indexRoute.all('/', (req, res) => res.json({ message: 'API index route' }));

module.exports = {
  indexRoute,
  issuesRoutes,
};
