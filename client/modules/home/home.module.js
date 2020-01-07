"use strict";


angular.module('exe.cms.home', ['ui.router'])
  .config(function ($stateProvider) {

    $stateProvider
      .state('cms.home', {
        url: '/home',
        data: {
          title: 'CMS'
        },
        views: {
          "content@cms": {
            templateUrl: 'modules/home/views/home.tpl.html'
          }
        }
      })
  });