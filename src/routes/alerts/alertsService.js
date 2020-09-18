const getUserAlerts = async (db, user_id) => {
  return await db('alerts')
    .select(
      'id', 'title', 'message', 'read', 'date_created'
    )
    .where({ user_id });
};

module.exports = {
  getUserAlerts,
}