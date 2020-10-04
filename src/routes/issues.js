const { Router } = require('express');
const { issuesController } = require('../controllers');

const issuesRoutes = Router();

issuesRoutes
  .route('/')
  .get([issuesController.getMetrics, issuesController.saveUserVisit]);

module.exports = issuesRoutes;
