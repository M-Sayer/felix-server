const convertToCents = (dollars) => {
  return dollars * 100;
};

const convertToDollars = (cents) => {
  return cents / 100;
};

module.exports = {
  convertToCents,
  convertToDollars
};

