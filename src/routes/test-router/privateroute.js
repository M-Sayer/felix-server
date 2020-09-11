const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/jwt-auth.js');

router.route('/').get((req, res) => {
  res.status(200).json('private route reached');
});

module.exports = router;
