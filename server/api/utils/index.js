const { generateToken, verfiyToken } = require('./jwt');
const { sendEmail } = require('./email');
const prettyError = require('./prettyerror');
const movies = require('./movies');

module.exports = {
  generateToken,
  verfiyToken,
  sendEmail,
  prettyError,
  movies
};
