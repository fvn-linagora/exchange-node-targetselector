const ActiveDirectory = require('activedirectory');
const json2csv = require('json2csv');
var program = require('commander');
const serverConfig = require('./config/serverConfig');
const authConfig = require('./credentialConfig');

program
  .version('0.0.1')
  .option('-g, --group <groupName>', 'Filter users on group name')
  .parse(process.argv);

const ad = new ActiveDirectory(Object.assign(serverConfig, authConfig));
const groupName = program.group || 'nested1group';

function buildCallback(resolve, reject) {
  return (err, result) => {
    if (err || !result)
      reject(err);
    else
      resolve(result);
  };
}

function getUsersForGroup(groupName) {
  return () => new Promise(function(resolve, reject) {
      ad.getUsersForGroup(groupName, buildCallback(resolve, reject));
    });
}

function dumpUsersPropsAsCSV(fields) {
  return users => new Promise(function (resolve, reject) {
    if (users)
      resolve(json2csv({ data: users, fields: fields }));
    else
      reject(`Group: ${groupName} not found`);
  });
}

// auth already done using config
getUsersForGroup(groupName)()
  .then(dumpUsersPropsAsCSV(['dn', 'mail']))
  .then(console.log)
  .catch(err => console.log('ERROR ' + JSON.stringify(err)))
  ;
