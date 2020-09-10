const express = require('express');
const path = require('path');
const UserService = require('./user-service.js');

const router = express.Router();
const jsonBodyParser = express.json();

const {
  createUser,
  validatePassword,
  getUserWithUsername,
  getUserWithEmail,
  hashPassword,
  unhashPassword,
} = require('./user-service.js');

router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { first_name, last_name, username, password, email } = req.body;

    //Check that fields exist
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
      //check that password matches requirements
      const passwordError = validatePassword(password);

      //if password does not meet requirements return error
      if (passwordError) return res.status(400).json({ error: passwordError });

      //checks if username already exists in db
      const hasUsername = await getUserWithUsername(db, username);

      //if username is already taken return error
      if (hasUsername)
        return res.status(400).json({ error: `Username unavailable` });

      //checks if email already exists in db
      const hasEmail = await getUserWithEmail(db, email);

      //if email is already taken return error
      if (hasEmail)
        return res.status(400).json({ error: `Email already in use` });

      //hash the user's password
      const hashedPassword = await hashPassword(password);

      //build new user object
      const newUser = {
        first_name,
        last_name,
        username,
        password: hashedPassword,
        email,
      };

      //insert new user object into database
      const user = await createUser(db, newUser);

      //get user id and username from db to creaet jwt token
      const sub = user.username;
      const payload = { user_id: user.id };

      //create and send jwt token
      res.status(200).json({
        authToken: UserService.createJwt(sub, payload),
      });
    } catch (error) {
      next(error);
    }
  });

router
  .route('/login') // Supports POST
  .post(async (req, res, next) => {
    const { username, password } = await req.body;
    const db = req.app.get('db');

    //Check that fields exist
    for (const field of ['username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    try {
      //get user object to check against POSTed username and password
      const hasUser = await getUserWithUsername(db, username);

      //if hasUser is undefined (username does not exist in db) return error
      if (!hasUser) {
        return res.status(401).json({ error: `invalid credentials` });
      }

      //if password is wrong return error
      if (!(await unhashPassword(password, hasUser.password))) {
        return res.status(401).json({ error: `invalid credentials` });
      }

      //get user id and username from db to creaet jwt token
      const sub = hasUser.username;
      const payload = { user_id: hasUser.id };

      //create and send jwt token
      res.status(200).json({
        authToken: UserService.createJwt(sub, payload),
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
