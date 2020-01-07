//node initdb.js

var server = require('../server/server');
var mysqlDs = server.dataSources.mysqlDs;
var mongoDs = server.dataSources.mongoDs;
var mysqlTables = [
  'accessToken',
  'user',
  'userCredential',
  'userIdentity',
  'ACL',
  'AuthProvider',
  'RoleMapping',
  'Role',
  'AppModel',
  'Meta',
  'Setting',
  'Event'
];
var mongoCollections = [
  'Hotlist',
  'MarketingPages',
  'MarketingPagesRecord'
];

if (mysqlDs.connected) {
  mysqlDs.autoupdate(mysqlTables, function(er) {
    if (er) throw er;
    console.log('tables [' + mysqlTables + '] created in ', mysqlDs.adapter.name);
    mysqlDs.disconnect();
  });
} else {
  mysqlDs.once('connected', function() {
    mysqlDs.autoupdate(mysqlTables, function(er) {
      if (er) throw er;
      console.log('tables [' + mysqlTables + '] created in ', mysqlDs.adapter.name);
      mysqlDs.disconnect();
    });
  })
}


if (mongoDs.connected) {
  mongoDs.autoupdate(mongoCollections, function(er) {
    if (er) throw er;
    console.log('tables [' + mongoCollections + '] created in ', mongoDs.adapter.name);
    mongoDs.disconnect();
  });
} else {
  mongoDs.once('connected', function() {
    mongoDs.autoupdate(mongoCollections, function(er) {
      if (er) throw er;
      console.log('tables [' + mongoCollections + '] created in ', mongoDs.adapter.name);
      mongoDs.disconnect();
    });
  })
}