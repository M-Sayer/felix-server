// this script will be automated by Heroku Scheduler
// it will run every every sunday at 00:01 UTC
// for dev, we'll run it every 2 minutes


// this script needs to query the goals table
// select all goals that are not complete
// join the users table on uid and select balance and allowance
// for each goal -> 
//  if allowance > contribution amt. -> 
//    get allowance
//    if goal amt. - current amt. > contribution amt. ->      
//      subtract contribution amt. from allowance && add to current amt.
//      update db
//      continue with next goal
//    if goal amt. - current amt. = contribution amt. ->
//      subtract contribution amt. from allowance && add to current amt.
//      set "completed" to true
//      alert user: goal successful
//      update db
//      continue with next goal
//    if goal amt. - current amt. < contribution amt. ->
//      subtract (goal amt. - current amt.) from allowance && add to current amt.
//      set "completed" column true
//      alert user: goal successful
//      update db
//      continue with next goal
//    
//  if allowance < contribution amt. -> 
//    alert user: not enough allowance to fund goal
//    update db
//    continue with next goal


//check end date

const {
  selectGoals,
  updateGoal,
  createAlert,
  selectUserAllowance,
  moveContribution,
} = require('./automationHelpers');

async function automatedGoals () {
  try {
    const goals = await selectGoals({ 'completed': 'false' });

    goals.forEach(async goal => {
      const allowance = await selectUserAllowance(goal.user_id);
      if (allowance > goal.contribution_amount) {
        if (goal.goal_amount - goal.current_amount > goal.contribution_amount) {
          return moveContribution(goal, allowance, adjusted = false);
        }
        if (goal.goal_amount - goal.current_amount === goal.contribution_amount) {
          moveContribution(goal, allowance, adjusted = false);
          await updateGoal(goal.id, { 'completed': true });
          await createAlert(goal.user_id, complete = true, goal.name);
          return;
        }
        if (goal.goal_amount - goal.current_amount < goal.contribution_amount) {
          moveContribution(goal, allowance, adjusted = true);
          await updateGoal(goal.id, { 'completed': true });
          await createAlert(goal.user_id, complete = true, goal.name);
          return;
        }
      }  
      if (allowance < goal.contribution_amount) {
        await createAlert(goal.user_id, complete = false, goal.name);
        return;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = automatedGoals;