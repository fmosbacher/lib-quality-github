const { Router } = require('express');
const { historyController } = require('../controllers');

const historyRoutes = Router();

historyRoutes
  .route('/')
  .get(historyController.getMetrics);

historyRoutes
  .route('/repo')
  .post(historyController.addRepoToHistory)
  .delete(historyController.removeRepoFromHistory);

module.exports = historyRoutes;
