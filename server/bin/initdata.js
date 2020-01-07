//INITDATA=true node initdata.js

'use strict';

var app = require('../server/server');

loadSettingsData()
createDefaultUsers();

function loadSettingsData() {
  var Setting = app.models.Setting;

  function loadDefaultSettings() {
    console.error('Creating default settings');

    var settings = [{
      type: 'string',
      key: 'appName',
      value: 'JFCMS'
    }, {
      type: 'select',
      key: 'appTheme',
      value: 'skin-blue',
      options: [
        'skin-blue',
        'skin-black'
      ]
    }, {
      type: 'select',
      key: 'appLayout',
      value: 'fixed',
      options: [
        'skin-blue',
        'not-fixed'
      ]
    }, {
      type: 'string',
      key: 'formLayout',
      value: 'horizontal'
    }, {
      type: 'int',
      key: 'formLabelSize',
      value: 3
    }, {
      type: 'int',
      key: 'formInputSize',
      value: 9
    }, {
      type: 'boolean',
      key: 'com.module.users.enable_registration',
      value: true
    }];

    settings.forEach(function (setting) {
      Setting.create(setting, function (err) {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  function loadExistingSettings() {
    console.log('Loading existing settings');

    Setting.find(function (data) {
      console.log(data);
    });
  }


  Setting.count(function (err, result) {
    if (err) {
      console.error(err);
    }
    if (result < 1) {
      loadDefaultSettings();
    } else {
      loadExistingSettings();
    }
  });
}

function createDefaultUsers() {

  console.log('Creating roles and users');

  var User = app.models.User;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  var users = [];
  var roles = [{
    name: 'admin',
    users: [{
      firstName: 'Admin',
      lastName: 'User',
      email: 'pyj92055@163.com',
      username: 'pengyajun',
      password: 'passw0rd'
    }]
  }, {
    name: 'operation',
    users: []
  }, {
    name: 'test',
    users: []
  }, {
    name: 'sales',
    users: []
  }];

  roles.forEach(function (role) {
    Role.findOrCreate({
        where: {
          name: role.name
        }
      }, // find
      {
        name: role.name
      }, // create
      function (err, createdRole, created) {
        if (err) {
          console.error('error running findOrCreate(' + role.name + ')', err);
        }
        (created) ? console.log('created role', createdRole.name): console.log('found role', createdRole.name);
        role.users.forEach(function (roleUser) {
          User.findOrCreate({
              where: {
                email: roleUser.email
              }
            }, // find
            roleUser, // create
            function (err, createdUser, created) {
              if (err) {
                console.error('error creating roleUser', err);
              }
              (created) ? console.log('created user', createdUser.email): console.log('found user', createdUser.email);
              createdRole.principals.create({
                principalType: RoleMapping.USER,
                principalId: createdUser.id
              }, function (err, rolePrincipal) {
                if (err) {
                  console.error('error creating rolePrincipal', err);
                }
                users.push(createdUser);
              });
            });
        });
      });
  });
  return users;
}