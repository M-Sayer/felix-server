const scheduledGoalsService = {
  getGoals(db) {
    return db('goals').where('completed', '=', 'false')
  }
}