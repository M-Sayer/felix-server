const express = require('express');
const time = require('../../time');


const timeRouter = express.Router();


timeRouter
  .route('/')
  .get(async (req, res, next) => {
    //current moment in time
    var moment = time.moment;
    moment.tz.setDefault('EST')
    var timeNow = moment();
    var utcTime = moment();
    // create flag to display time in UTC
    // utcTime.utc();
    var pst = timeNow.tz('PST').format('HH:mm, ddd MMM Do, YYYY');
   
    //res body to display some time info for dev purposes
    const timeInfo = {
      timeZoneOffset: timeNow.utcOffset(), //offset from UTC
      serverTimeUTC: utcTime.format('X'), //timestamp
      serverTime: timeNow.format('HH:mm, ddd MMM Do, YYYY'),
      timeZone: timeNow.format('z'), // server default
      pacificTime: pst,
    }

    

    res.send(timeInfo)

  })

module.exports = timeRouter;
