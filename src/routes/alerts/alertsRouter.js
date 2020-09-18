const express = require('express');
const { requireAuth } = require('../../middleware/jwtAuth');
const { getUserAlerts } = require('./alertsService');

const alertsRouter = express.Router();

alertsRouter
  .route('/')
  .get(requireAuth, async (req, res, next) => {
    try {
      const userId = req.userId;
      const db = req.app.get('db');
      const alerts = await getUserAlerts(db, userId);
      return res.send(alerts)
    } catch (error) {
      console.log(error)
    }
  })

module.exports = alertsRouter;