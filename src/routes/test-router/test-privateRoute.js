const express = require('express');
const router = express.Router();
//This route is just for testing if the private route is protected by the auth service
router.route('/').get((req, res) => {
  res.status(200).json('private route reached');
});

module.exports = router;
