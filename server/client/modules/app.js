'use strict';

/**
 * @ngdoc overview
 * @name app [exe promotion system]
 * @description
 * # app [exe promotion system]
 *
 * Main module of the application.
 */

angular.module('exe.experience', [
  // App
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ngCookies',
  'ngDialog',
  'dndLists',
  // App
  'exe.experience.config',
  'exe.experience.gallery'
])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('experience', {
      url: '',
      data: {
        title: 'experience'
      },
      views: {
        "root": {
          templateUrl: 'modules/layout/layout.tpl.html',
        }
      }
    })

  $urlRouterProvider.otherwise('/gallery');

})

.run(function($rootScope, APP_CONFIG, $timeout) {
  $rootScope.APP_CONFIG = APP_CONFIG;

  $rootScope.applicationName = 'exe.experience'
  $rootScope.applicationTitle = 'EXE 新品体验馆'
})

.run(function($state, $rootScope){
  //30秒无操作，跳转回首页
  var timer = 1;

  setInterval(function(){
    if(timer%30 == 0 && timer){
      $state.go("experience.gallery.theme");
      timer =1;
    }
    timer++;
  },1000); 

  function clickPage(event){
    timer = 1;
  }

  $(document).on('touchstart',clickPage);
  $(document).on('mousedown',clickPage);
})

// .run(function($rootScope, $location, $state, $stateParams) {
//   $rootScope.$state = $state;
//   $rootScope.$stateParams = $stateParams;
// })
