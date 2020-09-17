const convertToCents = (dollars) => {
  return dollars * 100;
};

const convertToDollars = (cents) => {
  return cents / 100;
};

const convertTransactionsToDollars = (arr, type) => {
  return arr.map(obj => {
    const dollarAmount = convertToDollars(obj[`${type}_amount`]);
    obj[`${type}_amount`] = dollarAmount;
    return obj;
  });
};

module.exports = {
  convertToCents,
  convertToDollars,
  convertTransactionsToDollars,
};

