(function () {
  'use strict';
  angular.module('exe.cms.marketing.ids', [])

  .config(function($stateProvider) {
    $stateProvider
      .state('cms.marketingIds', {
        abstract: true,
        data: {
          title: 'Marketing IDs'
        },
        url: '/marketing/ids',
        views:{
          "content@cms": {
            templateUrl: 'modules/marketing/ids/views/main.tpl.html'
          }
        }
      })
      .state('cms.marketingIds.list', {
        url: '',
        templateUrl: 'modules/marketing/ids/views/list.tpl.html',
        controllerAs: 'ctrl',
        controller: function($scope, MarketingsService, $location) {
          this.searchObj = $location.search();
          this.page = this.searchObj.page || 1;
          this.limit = this.searchObj.limit || 20;

          this.query = function() {
            $location.search({page:this.page,limit:this.limit});
            this.loadMarketings();
          }

          this.loadMarketings = function(){
            MarketingsService.getMarketings({
              page:this.page,
              limit:this.limit
            }).then(function(result){
              $scope.ctrl.marketings = result.data;
              $scope.ctrl.total = result.total;
            });
          }

          this.loadMarketings();

        }
      })
      .state('cms.marketingIds.add', {
        url: '/add',
        data: {
          title: '添加 Marketing ID'
        },
        templateUrl: 'modules/marketing/ids/views/form.tpl.html',
        controllerAs: 'ctrl',
        controller: function($state, MarketingsService, marketing) {
          this.marketing = marketing;
          this.marketing.end_time1 = this.marketing.start_time1 = new Date();
          this.formFields = MarketingsService.getFormFields();
          this.formOptions = {};
          this.submit = function() {
            MarketingsService.createMarketing(this.marketing).then(function() {
              $state.go('^.list');
            }, function(error){
              console.log(error)
            });
          };
        },
        resolve: {
          marketing: function() {
            return {};
          }
        }
      })
      .state('cms.marketingIds.edit', {
        url: '/:id/edit',
        data: {
          title: '编辑 Marketing ID'
        },
        templateUrl: 'modules/marketing/ids/views/form.tpl.html',
        controllerAs: 'ctrl',
        controller: function($state, MarketingsService, marketing) {
          marketing.id = marketing.marketing_id
          this.marketing = marketing;
          this.marketing.end_time1 = this.marketing.start_time1 = new Date();
          this.formFields = MarketingsService.getFormFields();
          this.formOptions = {};
          this.submit = function() {
            MarketingsService.updateMarketing(this.marketing).then(function() {
              $state.go('^.list');
            }, function(error){
              console.log(error)
            });
          };
        },
        resolve: {
          marketing: function($stateParams, MarketingsService) {
            return MarketingsService.getMarketing($stateParams.id);
          }
        }
      })
      .state('cms.marketingIds.view', {
        url: '/:id',
        templateUrl: 'modules/marketing/ids/views/view.tpl.html',
        controllerAs: 'ctrl',
        controller: function(marketing) {
          this.marketing = marketing;
        },
        resolve: {
          marketing: function($stateParams, MarketingsService) {
            return MarketingsService.getMarketing($stateParams.id);
          }
        }
      })
      .state('cms.marketingIds.delete', {
        url: '/:id/delete',
        template: '',
        controllerAs: 'ctrl',
        controller: function($state, MarketingsService, event) {
          MarketingsService.deleteEvent(event.id, function() {
            $state.go('^.list');
          }, function() {
            $state.go('^.list');
          });
        },
        resolve: {
          event: function($stateParams, MarketingsService) {
            return MarketingsService.getEvent($stateParams.id);
          }
        }
      });
  })

  .run(function ($rootScope, Event) {
    
  });
})();
