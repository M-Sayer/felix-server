var moment = require('moment-timezone');
moment.tz.setDefault('EST');

const time = {
  moment: moment,
};

module.exports = time;