const express = require('express');
const path = require('path');

// AuthRouter
const router = express.Router();
const jsonBodyParser = express.json(); // May be redundant, check app

const {
  createUser,
  getUser, // ??
  validatePassword,
  getUserWithUsername,
  getUserWithEmail,
  hashPassword,
  unhashPassword,
} = require('./user-service.js');

// AuthRouter
router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { first_name, last_name, username, password, email } = req.body;

    // Check that fields exist
    for (const field of [
      'first_name',
      'last_name',
      'username',
      'password',
      'email',
    ])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    try {
      // Check that password matches requirements
      const passwordError = validatePassword(password);

      // If password does not meet requirements return error
      if (passwordError)
        return res.status(400).json({ error: passwordError });

      // Check if username already exists in db
      const hasUsername = await getUserWithUsername(db, username);

      // If username is already taken return error
      if (hasUsername)
        return res.status(400).json({ error: `Username unavailable` });

      // Check if email already exists in db
      const hasEmail = await getUserWithEmail(db, email);

      // If email is already taken return error
      if (hasEmail)
        return res.status(400).json({ error: `Email already in use` });

      // Hash the user's password
      const hashedPassword = await hashPassword(password);

      // Build new user object
      const newUser = {
        first_name,
        last_name,
        username,
        password: hashedPassword,
        email,
      };

      // Insert new user object into database
      const user = await createUser(db, newUser); // Do we need this variable if we're not using it??

      // Respond with a JWT
      res.status(200).json({ authToken: 'JWTString' });
    } catch (error) {
        next(error);
    }
  });

router
  .route('/login') // Supports POST
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { username, password } = req.body; // Removed await

    // Check that fields exist
    for (const field of ['username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    try {
      // Get user object to check against POSTed username and password
      const hasUser = await getUserWithUsername(db, username);

      // If hasUser is undefined (username does not exist in db), return error
      if (!hasUser) {
        return res.status(401).json({ error: `Invalid credentials` });
      }

      // If password is wrong return error
      if ((await unhashPassword(password, hasUser.password)) === false) {
        return res.status(401).json({ error: `Invalid credentials` });
      }

      // Respond with a JWT
      res.status(200).json({ authToken: 'JWTString' });
    } catch (error) {
        next(error);
    }
  });

module.exports = router;
