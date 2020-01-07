(function() {
  'use strict';
  angular.module('exe.cms.hotlists', [])

  .config(function($stateProvider) {
    $stateProvider
      .state('cms.hotlists', {
        abstract: true,
        url: '/hotlists',
        views: {
          "content@cms": {
            templateUrl: 'modules/hotlists/views/main.tpl.html'
          }
        }
      })
      .state('cms.hotlists.list', {
        url: '',
        templateUrl: 'modules/hotlists/views/list.tpl.html',
        controllerAs: 'ctrl',
        controller: function(hotlists) {
          this.hotlists = hotlists;
        },
        resolve: {
          hotlists: function(HotlistService) {
            return HotlistService.getHotlists();
          }
        }
      })
      .state('cms.hotlists.add', {
        url: '/add',
        templateUrl: 'modules/hotlists/views/form.tpl.html',
        controller: 'HotlistCtrl',
        resolve: {
          hotlist: function() {
            return {};
          }
        }
      })
      .state('cms.hotlists.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/hotlists/views/form.tpl.html',
        controller: 'HotlistCtrl',
        resolve: {
          hotlist: function($stateParams, HotlistService) {
            return HotlistService.getHotlistWithProducts($stateParams.id);
          }
        }
      })
      .state('cms.hotlists.view', {
        url: '/:id',
        templateUrl: 'modules/hotlists/views/view.tpl.html',
        controllerAs: 'ctrl',
        controller: function(hotlist) {
          this.hotlist = hotlist;
        },
        resolve: {
          hotlist: function($stateParams, HotlistService) {
            return HotlistService.getHotlist($stateParams.id);
          }
        }
      })
      .state('cms.hotlists.delete', {
        url: '/:id/delete',
        template: '',
        controllerAs: 'ctrl',
        controller: function($state, HotlistService, event) {
          HotlistService.deleteEvent(event.id, function() {
            $state.go('^.list');
          }, function() {
            $state.go('^.list');
          });
        },
        resolve: {
          event: function($stateParams, HotlistService) {
            return HotlistService.getEvent($stateParams.id);
          }
        }
      });
  })

})();
