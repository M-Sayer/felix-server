
require('dotenv').config();
const app = require('./app');
const knex = require('knex');
const {PORT , DATABASE_URL} = require('./config');

const db = knex({
  client : 'pg',
  connection : DATABASE_URL,
});

app.set('db',db);

// our localhost dev server will listen on port 8000
app.listen(PORT, () => {
  console.log(`Felix is assisting on port ${PORT}`);
});