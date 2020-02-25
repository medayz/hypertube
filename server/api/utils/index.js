const { generateToken, verfiyToken } = require('./jwt');
const prettyError = require('./prettyerror');
const movies = require('./movies');

module.exports = {
  generateToken,
  verfiyToken,
  prettyError,
  movies
};
