const express = require('express');

const UsersRouter = express.Router();
const UsersRouterService = require('./usersRouterService');

UsersRouter
  .route('/user/:id')
  .get(async(req, res, next) => {
    // const user_id = req.user.user_id;
    const user_id = 1; // Temp

    try {
      const user = await UsersRouterService.getUserDetails(req.app.get('db'), user_id); // Returns an array of user details obj

      return res.json(...user); // Returns a user obj
    }
    catch(error) {
      next(error);
    }
  })

UsersRouter
  .route('/transactions')
  .get(async(req, res, next) => {
    // const user_id = req.user.user_id;
    const user_id = 1; // Temp
    
    try {
      const income = await UsersRouterService.getUserIncome(req.app.get('db'), user_id); // Array of income objects
      const expenses = await UsersRouterService.getUserExpense(req.app.get('db'), user_id); // Array of expense objects
      // No need to sort, already in chronological order
      console.log({income, expenses})
      res.json({income, expenses})
    }
    catch(error) {
      next(error);
    }
  })

module.exports = UsersRouter;