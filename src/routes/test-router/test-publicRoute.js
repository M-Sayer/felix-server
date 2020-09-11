const express = require('express');
const router = express.Router();
//This route is just for testing if the public route is *not* protected by the auth service
router.route('/').get((req, res) => {
  res.status(200).json('public route reached');
});

module.exports = router;
