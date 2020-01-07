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

    settings.forEach(function(setting) {
      Setting.create(setting, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  function loadExistingSettings() {
    console.log('Loading existing settings');

    Setting.find(function(data) {
      console.log(data);
    });
  }


  Setting.count(function(err, result) {
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
      email: 'chenxinwei@jingfree.com',
      username: 'chenxinwei',
      password: 'Passw1rd!'
    },{
      email: 'pengyajun@jingfree.com',
      username: '彭亚军先生',
      password: 'adminn'
    },{
      email: 'hongxiaolong@jingfree.com',
      username: '洪小龙先生',
      password: 'hxl0722'
    }]
  },{
    name: 'operation',
    users: [{
      email: 'daimuqing@jingfree.com',
      username: '戴沐青女士',
      password: 'dxh888'
    },{
      email: 'fengzhiwei@jingfree.com',
      username: '冯志微女士',
      password: 'fzw888'
    }]
  },{
    name: 'test',
    users: [{
      email: 'fangyuan@jingfree.com',
      username: '方圆女士',
      password: 'fy666'
    },{
      email: 'liuqing@jingfree.com',
      username: '柳清女士',
      password: 'lq666'
    }]
  },{
    name: 'sales',
    users: [{
      email: 'liyao@jingfree.com',
      username: '李瑶',
      password: 'ly999'
    }]
  }];

  roles.forEach(function(role) {
    Role.findOrCreate({ where: { name: role.name } }, // find
      { name: role.name }, // create
      function(err, createdRole, created) {
        if (err) {
          console.error('error running findOrCreate(' + role.name + ')', err);
        }
        (created) ? console.log('created role', createdRole.name): console.log('found role', createdRole.name);
        role.users.forEach(function(roleUser) {
          User.findOrCreate({ where: { email: roleUser.email } }, // find
            roleUser, // create
            function(err, createdUser, created) {
              if (err) {
                console.error('error creating roleUser', err);
              }
              (created) ? console.log('created user', createdUser.email): console.log('found user', createdUser.email);
              createdRole.principals.create({
                principalType: RoleMapping.USER,
                principalId: createdUser.id
              }, function(err, rolePrincipal) {
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
