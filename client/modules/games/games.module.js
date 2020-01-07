"use strict";

angular.module('exe.cms.games', [
  'ui.router',
  'exe.cms.games.data'
])

.config(function($stateProvider) {
  $stateProvider
    .state('cms.games', {
      url: '/games',
      data: {
        title: '游戏'
      },
      views: {
        "content@cms": {
          templateUrl: 'modules/games/data/views/view.tpl.html',
          controller: 'gameDataCtrl'
        }
      }
    })
})

;
