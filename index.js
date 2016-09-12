const ActiveDirectory = require('activedirectory');
const json2csv = require('json2csv');
const program = require('commander');
const authConfig = require('./credentialConfig');
const NB_REQUIRED_ARGS = 7;
const CSV_FIELDS_MAP = new Map([
  ['dn', 'DistinguishedName'],
  ['userPrincipalName', 'PrimarySmtpAddress'],
  ['mail', 'EmailAddresses']]
);

program.on('--help', function() {
  console.log([
    '  Examples:',
    '',
    '    $ node index.js -g Users -u ldap://acme.org -d DC=acme,DC=org',
    ''
  ].join('\n'));

});
program
  .version('0.0.1')
  .option('-g, --group <groupName>', 'filter users on group name')
  .option('-u, --ldap-endpoint <ldapPath>', 'specify LDAP endpoint url')
  .option('-d, --base-dn <ldapDN>', 'specify LDAP base Distringuished Name')
  .parse(process.argv);

if (!process.argv.slice(NB_REQUIRED_ARGS).length) {
  program.help();
}

function validateArguments(program) {
  if (!program.ldapEndpoint) {
    throw new Error('No LDAP endpoint provided. Please provide server Uri !');
  }
  if (program.ldapEndpoint && !(/^ldap:\/\//).test(program.ldapEndpoint)) {
    throw new Error('LDAP endpoint uri provided is not valid !!');
  }
  if (!program.baseDn) {
    throw new Error('No base Distringuished Name provided. Please provide one');
  }
  if (!program.group || !program.group.trim()) {
    throw new Error('No Active Directory group name provided! ' +
      'Cannot select users');
  }
}

function buildCallback(resolve, reject) {
  return (err, result) => {
    if (err || !result)
      reject(err);
    else
      resolve(result);
  };
}

function buildDirectoryConfig(program, authConfig) {
  const serverConfig = {
    url: program.ldapEndpoint,
    baseDN: program.baseDn
  };
  if (! authConfig.password) {
    throw new Error('Password not provided (through env. variable PASSWORD) !');
  }

  return Object.assign(serverConfig, authConfig);
}

validateArguments(program);
const ad = new ActiveDirectory(buildDirectoryConfig(program, authConfig));
const groupName = program.group;

function getUsersForGroup(groupName) {
  return () => new Promise(function(resolve, reject) {
      ad.getUsersForGroup(groupName, buildCallback(resolve, reject));
    });
}

function dumpUsersPropsAsCSV(fieldsMap) {
  return users => new Promise(function (resolve, reject) {
    if (users)
      resolve(json2csv({ data: users,
        fields: [...fieldsMap.keys()],
        fieldNames: [...fieldsMap.values()] }));
    else
      reject(`Group: ${groupName} not found`);
  });
}

getUsersForGroup(groupName)()
  .then(dumpUsersPropsAsCSV(CSV_FIELDS_MAP))
  .then(console.log)
  .catch(err => console.log('ERROR ' + JSON.stringify(err)))
  ;
