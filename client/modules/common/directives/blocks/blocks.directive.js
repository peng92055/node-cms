(function () {
  'use strict';

  angular
    .module('exe.cms.common')
    .directive('commonTemplate', function () {
      return {
        restrict : 'EAC',
        scope: {
          options: '='
        },
        templateUrl: 'modules/common/directives/blocks/common-template.tpl.html',
        link: function($scope) {

          $scope.addRow = function() {
            $scope.options.rows = $scope.options.rows || [];
            $scope.options.rows.push({'columns':'1','images':[{'image_url':'','opts':{'type':'normal'}}]})
          }

          $scope.changeColumns = function(row) {
            var images = row.images;
            var _images = [];
            for(var i=0;i<row.columns;i++){
              if(i > images.length-1){
                _images.push({
                  "image_url": "",
                  "opts": {
                    "type": "normal"
                  }
                })
              }else{
                _images.push(images[i]);
              }
            }
            row.images = _images;
          }

          $scope.dynamicPopover = {
            templateUrl: 'eleActionPopover.tpl.html',
            title: '元素行为'
          };
        }
      };
    })

    .directive('commonHead', function () {
      return {
        restrict : 'EAC',
        scope: {
          options: '='
        },
        templateUrl: 'modules/common/directives/blocks/common-head.tpl.html',
        link: function($scope) {
          $scope.date = {
            open: false
          }

          $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2500, 1, 1),
            minDate: new Date(),
            startingDay: 1
          };

          $scope.openDate = function(){
            $scope.date.open = true;
          }

          $scope.updateCountType = function(){
            if($scope.options.countdown && !$scope.options.countdown.type){
              delete $scope.options.countdown;
            }
          }

          $scope.updateSubtitleType = function(){
            if($scope.options.subtitle_type == 'complex') {
              $scope.options.subtitle_prefix = "已有";
              $scope.options.subtitle_suffix = "人领取";
            }
          }

          if($scope.options.countdown && $scope.options.countdown.type == 'end'){
            if($scope.options.countdown.end_time){
              $scope.options.countdown.end_time = new Date($scope.options.countdown.end_time);
            }
          }
        }
      };
    })

    .directive('storeIntro', function () {
      return {
        restrict : 'EAC',
        scope: {
          options: '='
        },
        templateUrl: 'modules/common/directives/blocks/store-intro.tpl.html',
        link: function($scope) {
          
        }
      };
    })

    .directive('bottomBar', function () {
      return {
        restrict : 'EAC',
        scope: {
          options: '='
        },
        templateUrl: 'modules/common/directives/blocks/bottom-bar.tpl.html',
        link: function($scope) {
          $scope.updateSubtitleType = function(){
            if($scope.options.subtitle_type == 'complex') {
              $scope.options.subtitle_prefix = "已有";
              $scope.options.subtitle_suffix = "人领取";
            }
          }
        }
      };
    })

    .directive('storeIntroMap', function () {
      return {
        restrict : 'EAC',
        scope: {
          options: '='
        },
        templateUrl: 'modules/common/directives/blocks/store-intro-map.tpl.html',
        link: function($scope) {
          $scope.options = $scope.options || {};
          $scope.options.open_reviews = !!$scope.options.open_reviews;
          $scope.options.theme = $scope.options.theme || '';
        }
      };
    });

})();
