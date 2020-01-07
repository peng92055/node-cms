(function() {
  'use strict';
  angular.module('exe.cms.marketing.events', ['dndLists'])

  .config(function($stateProvider) {
    $stateProvider
      .state('cms.events', {
        abstract: true,
        url: '/marketing/events',
        data: {
          title: 'M站预约页'
        },
        views: {
          "content@cms": {
            templateUrl: 'modules/marketing/events/views/main.tpl.html'
          }
        }
      })
      .state('cms.events.list', {
        url: '',
        templateUrl: 'modules/marketing/events/views/list.tpl.html',
        controllerAs: 'ctrl',
        controller: function(events) {
          this.events = events;
        },
        resolve: {
          events: function(EventsService) {
            return EventsService.getEvents();
          }
        }
      })
      .state('cms.events.add', {
        url: '/add',
        data: {
          title: '添加M站预约页'
        },
        templateUrl: 'modules/marketing/events/views/form.tpl.html',
        controllerAs: 'ctrl',
        controller: function($state, EventsService, event, $scope) {
          $scope.selectedAll = true;
          $scope.selectedNone = false;
          this.event = event;
          this.event['stores_order'] = [];
          this.formFields = EventsService.getFormFields();
          this.formOptions = {};
          this.selectedStore = {};
          $scope.stores = [];
          EventsService.getStores().then(function(data) {
            for (var i = 0; i < data.length; i++) {
              var store = {
                'name': data[i].name,
                'id': data[i].optical_store_id,
                'selected': true
              };
              $scope.stores.push(store);
            }
          });

          this.selectStores = function(type) {
            $scope.selectedAll = type == "all" ? true : false;
            $scope.selectedNone = type == "none" ? true : false;
            if(type == "all" || type == "none"){
              for (var i = 0, l = $scope.stores.length; i<l; i++) {
                var e = $scope.stores[i];
                e.selected = type == "all" ? true: false;
              }
            }
          }

          $scope.checkSelected = function(){
            for (var i = 0; i < $scope.stores.length; i++) {
              if($scope.selectedAll && !$scope.stores[i]['selected'] ){
                $scope.selectedAll = false;
                break;
              }

              if($scope.selectedNone && $scope.stores[i]['selected']){
                $scope.selectedNone = false;
                break;
              }
            }

            var allSelectd = true,
                noneSelectd = true;
            for (var i = 0; i < $scope.stores.length; i++) {
              if(!$scope.stores[i]['selected']){
                allSelectd = false;
              }

              if($scope.stores[i]['selected']){
                noneSelectd = false;
              }
            }

            if(allSelectd) {
              $scope.selectedAll = true;
            }

            if(noneSelectd){
              $scope.selectedNone = true;
            }

          }

          this.submit = function() {
            var storeIdList = [];
            for (var i = 0; i < $scope.stores.length; i++) {
              if($scope.stores[i].selected == true){
                storeIdList.push($scope.stores[i]['id']);
              }
            }
            this.event['stores_order'] = storeIdList.join(',');
            EventsService.upsertEvent(this.event).then(function() {
              $state.go('^.list');
            });
          };
        },
        resolve: {
          event: function() {
            return {};
          }
        }
      })
      .state('cms.events.edit', {
        url: '/:id/edit',
        data: {
          title: '编辑M站预约页'
        },
        templateUrl: 'modules/marketing/events/views/form.tpl.html',
        controllerAs: 'ctrl',
        controller: function($state, EventsService, event, $scope) {
          // console.log(event);
          $scope.selectedAll = false;
          $scope.selectedNone = false;
          this.event = event;
          var stores_order = this.event['stores_order'] || [];
          this.formFields = EventsService.getFormFields();
          this.formOptions = {};
          $scope.stores = [];
          this.selectedStore = {};
          EventsService.getStores().then(function(data) {
            for (var i = 0; i < data.length; i++) {
              var store = {
                'name': data[i].name,
                'id': data[i].optical_store_id
              };
              $scope.stores.push(store);
            }
            sortStores();
            $scope.checkSelected();
          });

          function sortStores() {
            if (stores_order.length > 0) {
              var storeIdList = stores_order.split(',');
              var newStores = [];
              for (var i = 0; i < storeIdList.length; i++) {
                for (var j = 0; j < $scope.stores.length; j++) {
                  if (storeIdList[i] == $scope.stores[j]['id']) {
                    newStores.push($scope.stores[j]);
                    newStores[i]['selected'] = true;
                    $scope.stores.splice(j,1);
                    break;
                  }
                }
              }
              $scope.stores = newStores.concat($scope.stores);
            }
          }

          this.selectStores = function(type) {
            $scope.selectedAll = type == "all" ? true : false;
            $scope.selectedNone = type == "none" ? true : false;
            if(type == "all" || type == "none"){
              var selected = type == "all" ? true: false;
              for (var i = 0, l = $scope.stores.length; i<l; i++) {
                var e = $scope.stores[i];
                e.selected = selected;
              }
            }
          }

          $scope.checkSelected = function(){
            for (var i = 0; i < $scope.stores.length; i++) {
              if($scope.selectedAll && !$scope.stores[i]['selected'] ){
                $scope.selectedAll = false;
                break;
              }

              if($scope.selectedNone && $scope.stores[i]['selected']){
                $scope.selectedNone = false;
                break;
              }
            }

            var allSelectd = true,
                noneSelectd = true;
            for (var i = 0; i < $scope.stores.length; i++) {
              if(!$scope.stores[i]['selected']){
                allSelectd = false;
              }

              if($scope.stores[i]['selected']){
                noneSelectd = false;
              }
            }

            if(allSelectd) {
              $scope.selectedAll = true;
            }

            if(noneSelectd){
              $scope.selectedNone = true;
            }

          }

          this.submit = function() {
            var storeIdList = [];
            for (var i = 0; i < $scope.stores.length; i++) {
              if($scope.stores[i].selected == true){
                storeIdList.push($scope.stores[i]['id']);
              }
            }
            this.event['stores_order'] = storeIdList.join(',');
            EventsService.upsertEvent(this.event).then(function() {
              $state.go('^.list');
            });
          };

          
        },
        resolve: {
          event: function($stateParams, EventsService) {
            return EventsService.getEvent($stateParams.id);
          }
        }
      })
      .state('cms.events.view', {
        url: '/:id',
        templateUrl: 'modules/marketing/events/views/view.tpl.html',
        controllerAs: 'ctrl',
        controller: function(event) {
          this.event = event;
        },
        resolve: {
          event: function($stateParams, EventsService) {
            return EventsService.getEvent($stateParams.id);
          }
        }
      })
      .state('cms.events.delete', {
        url: '/:id/delete',
        template: '',
        controllerAs: 'ctrl',
        controller: function($state, EventsService, event) {
          EventsService.deleteEvent(event.id, function() {
            $state.go('^.list');
          }, function() {
            $state.go('^.list');
          });
        },
        resolve: {
          event: function($stateParams, EventsService) {
            return EventsService.getEvent($stateParams.id);
          }
        }
      });
  })

  .run(function($rootScope, Event) {

  });



})();
