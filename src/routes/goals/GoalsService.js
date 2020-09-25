const xss = require("xss");
const { selectGoalCurrentAmount, updateAllowance } = require("../../helpers");

const GoalsService = {
  getGoal(db, id) {
    return db('goals')
      .select('*')
      .where({ id })
      .first();
  },

  getGoals(db, user_id) {
    return db('goals')
      .select('*')
      .where({ user_id });
  },

  createGoal(db, newGoal) {
    return db('goals')
      .insert(newGoal);
  },

  updateGoal(db, id, updatedGoal) {
    return db('goals')
      .where({ id })
      .update(updatedGoal);
  },

  async deleteGoal(db, id, userId) {
    const amount = await selectGoalCurrentAmount(db, id);
    if (amount > 0) { 
      return await db.transaction(async trx => {
        await trx('goals').where({ id }).delete();
        return await trx('users').where({ id: userId }).update({
          allowance: trx.raw(`?? + ${amount}`, ['allowance']),
          total_saved: trx.raw(`?? - ${amount}`, ['total_saved'])
        });
      });
    } return db('goals').where({ id }).delete();
  },

  sanitizeGoal(goal) {
    return {
      ...goal,
      name: xss(goal.name)
    }
  },
}

module.exports = GoalsService;