(function() {
  'use strict';
  angular.module('exe.cms.games.data', [])

  .config(function($stateProvider) {
    $stateProvider
      .state('cms.games.data', {
        url: '/data',
        data: {
          title: '游戏数据'
        },
        views: {
          "content@cms": {
            templateUrl: 'modules/games/data/views/view.tpl.html',
            controller: 'gameDataCtrl'
          }
        }
      })
  })


})();
