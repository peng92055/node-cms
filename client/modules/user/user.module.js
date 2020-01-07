"use strict";

angular.module('exe.cms.user', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      passAuth: true,
      views: {
        root: {
          templateUrl: 'modules/user/views/login.tpl.html',
          controller: 'LoginCtrl'
        }
      },
      data: {
        title: '登录',
        htmlId: 'login'
      }
    })
})

;