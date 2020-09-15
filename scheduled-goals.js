// this script will be automated by Heroku Scheduler
// it will run every every sunday at 00:01 UTC
// for dev, we'll run it every 2 minutes


// this script needs to query the goals table
// select all goals that are not complete
// join the users table on uid and select allowance
// for each goal -> 
//  if allowance > contribution amt. -> 
//    if goal amt. - current amt. > contribution amt. ->      
//      subtract contribution amt. from allowance && add to goal
//    if goal amt. - current amt. = contribution amt. ->
//      subtract contribution amt. from allowance && add to goal
//      set "completed" to true
//      alert user: goal successful
//    if goal amt. - current amt. < contribution amt. ->
//      subtract (goal amt. - current amt.) from allowance && add to goal
//      set "completed" column true
//      alert user: goal successful
//    
//  if allowance < contribution amt. -> 
//    alert user: not enough allowance to fund goal

//check end date

const knex = require("knex");

const { DATABASE_URL } = require('./src/config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});


async function automateGoals () {
  try {
    const trxResult = await db.transaction(async trx => {
      const goals = await trx('goals')
        .select(
          'goals.id',
          'user_id',
          'goal_amount',
          'contribution_amount',
          'current_amount',
          'end_date',
          'completed',
          'users.allowance',
          'users.balance',
        )
        .where('completed', '=', 'false')
        .join('users', {'goals.user_id': 'users.id'});
      console.log(goals)

      goals.forEach(goal => {
        if (goal.allowance > goal.contribution_amount) {
          if (goal.goal_amount - goal.current_amount > goal.contribution_amount) {
            goal.allowance -= goal.contribution_amount
            goal.current_amount += goal.contribution_amount
            console.log(goal.id, goal.allowance, goal.current_amount)
          }
        }
      })
    });
    
  } catch (error) {
    console.log(error)
  }
};

module.exports = automateGoals;