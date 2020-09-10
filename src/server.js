const app = require('./app');
const knex = require('knex');
const {PORT , DATABASE_URL} = require('./config');

var cron = require('node-cron');
const fs = require('fs');

const db = knex({
  client : 'pg',
  connection : DATABASE_URL,
});

app.set('db',db);

var moment = require('moment-timezone');
var time = moment;
console.log(time())
console.log('not PST: ',time().format('z'));
time.tz.setDefault('America/Los_Angeles');
console.log('PST: ',time().format(''));

// console.log(Date.now());
// var then = moment();

// function checkTime() {

//   var now = moment();
//   console.log('the time was then: ', then.format());
//   console.log('the time is now: ', now.format());
//   console.log('now is after then? ',now.isAfter(then));
//   console.log('today is: ', moment().format());
//   moment().set('year', 2013);
//   console.log('today is: ', moment().format());
// }

// setInterval(checkTime, 5000);
console.log(moment().format('z'));

// cron.schedule('* * * * *', () => {
//   console.log('running a test every minute');
// });


// our localhost dev server will listen on port 8000
app.listen(PORT, () => {
  console.log(`Felix is assisting on port ${PORT}`);
});