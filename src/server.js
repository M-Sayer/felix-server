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
const format = 'HH:mm:ss ddd MMM Do, YYYY z';
//server time = moment in UTC
var serverTime = moment.utc();
// it's better to set by explicit region name than EST/EDT
// EST won't account for DST
// Does EDT account for !DST?
const EST = moment.tz('America/New_York');
const PST = moment.tz('America/Los_Angeles');


console.log('server time: ', serverTime.format(format));
console.log('East: ', EST.format(format));
console.log('DST? :', EST.isDST());
console.log('west: ', PST.format(format));

const oldTime = moment().format(format);

function checkTime() {
  const old = serverTime;

  var newTime = moment().format(format);
  const newTimeEst = moment.tz('America/New_York').format(format);

  console.log('----------')
  console.log('the server time was: ', serverTime.format(format));

  serverTime = moment.utc()
  const isAfter = moment(serverTime).isAfter(old);

  console.log('the server time is: ', serverTime.format(format));
  console.log('current server time is after old server time? ', isAfter);

  console.log('----------');

}

setInterval(checkTime, 10000);


// cron.schedule('* * * * *', () => {
//   console.log('running a test every minute');
// });


// our localhost dev server will listen on port 8000
app.listen(PORT, () => {
  console.log(`Felix is assisting on port ${PORT}`);
});