const { generateToken, verfiyToken } = require('./jwt');
const prettyError = require('./prettyerror');

module.exports = {
  generateToken,
  verfiyToken,
  prettyError
};
