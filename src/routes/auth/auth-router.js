const express = require('express');
const UserService = require('../user/user-service.js');
const router = express.Router();

router.route('/auth').post(async (req, res, next) => {
  const db = req.app.get('db');
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice('bearer '.length, authToken.length);
  }
  try {
    const payload = UserService.verifyJwt(bearerToken);
    const user = await UserService.getUserWithUsername(db, payload.sub);
    req.user = user;
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
  res.status(200).json('passed auth');
});
