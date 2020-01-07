'use strict';

/**
 * @ngdoc overview
 * @name app [exe promotion system]
 * @description
 * # app [exe promotion system]
 *
 * Main module of the application.
 */

angular.module('exe.cms', [
    // EXEAdmin Common Module
    'EXEAdmin',

    // App
    'exe.cms.config',
    'lbServices',
    'exe.cms.common',
    'exe.cms.home',
    'exe.cms.user',
    'exe.cms.marketing.m-pages',
    'exe.cms.marketing.events',
    'exe.cms.marketing.ids',
    'exe.cms.hotlists',
    'exe.cms.games'
  ])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('cms', {
        url: '',
        data: {
          title: 'CMS'
        },
        views: {
          "root": {
            templateUrl: 'EXEAdmin/layout/layout.tpl.html',
          }
        }
      })

    $urlRouterProvider.otherwise('/home');

  })

  .config(function ($provide, $httpProvider) {

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('ErrorHttpInterceptor');

  })

  .run(function (SmartMenuController) {

    var menus = [{
      title: '仪表盘',
      sref: 'cms.home',
      icon: 'dashboard',
      id: 'dashboard'
    }, {
      title: '营销',
      icon: 'shopping-cart',
      href: '#',
      items: [{
        title: 'M站营销页',
        sref: 'cms.marketingMPages.list',
        activeState: 'cms.marketingMPages',
        icon: 'tags'
      }, {
        title: '微信推广页',
        sref: 'cms.events.list',
        activeState: 'cms.events',
        icon: 'tags'
      }, {
        title: 'Marketing IDs',
        sref: 'cms.marketingIds.list',
        activeState: 'cms.marketingIds',
        icon: 'tags'
      }],
    }, {
      title: '排行榜',
      icon: 'list',
      sref: 'cms.hotlists.list',
      activeState: 'cms.hotlists',
      id: 'hotlist'
    }, {
      title: '游戏数据',
      icon: 'line-chart',
      sref: 'cms.games.data',
      activeState: 'cms.games',
      id: 'games'
    }];

    SmartMenuController.setMenus(menus)

  })

  .run(function ($rootScope, APP_CONFIG) {
    $rootScope.APP_CONFIG = APP_CONFIG;

    $rootScope.applicationName = 'exe.cms'
    $rootScope.applicationTitle = 'CMS 内容管理系统'
  })

  .run(function ($rootScope, $location, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  })

  .run(function ($rootScope, $location, AppAuth, $state) {
    $rootScope.logout = function () {
      AppAuth.logout().then(function (result) {
        $state.go('login')
      })
    }

    $rootScope.gotoLogin = function () {
      $location.path("/login")
    }
  });