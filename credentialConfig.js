/* eslint no-process-env: "off" */
const credentials = {
  username: process.env.LOGIN || 'Administrator',
  password: process.env.PASSWORD
};

module.exports = credentials;
