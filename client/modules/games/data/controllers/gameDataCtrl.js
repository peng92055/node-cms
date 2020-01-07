"use strict";

angular.module('exe.cms.games.data')
  .controller('gameDataCtrl', ['$scope', '$location', '$state', 'GameDataService',
    function ($scope, $location, $state, GameDataService) {

      // $scope.dataToDisplay = [
      //   'gameOpen',
      //   'gameStart',
      //   'gameOver',
      //   'gameRestart',
      //   'gameShare',
      //   'gameShareSucceed',
      //   'gameShareCancel'
      // ];

      $scope.dataToDisplay = [
        'pageOpen',
        'pageBulukeShake',
        'pageQiaobaShake',
        'pageClickAssist',
        'pageShowMarketing',
        'pageClickAppointmentBtn',
        'pageAppointmentSuccess'
      ];

      $scope.selectDate = [{
        label: "2016-12-28 00:00:00",
        value: "2016-12-28"
      }, {
        label: "2016-12-29 00:00:00",
        value: "2016-12-29"
      }, {
        label: "2016-12-30 00:00:00",
        value: "2016-12-30"
      }, {
        label: "2016-12-31 00:00:00",
        value: "2016-12-31"
      }, {
        label: "2017-01-01 00:00:00",
        value: "2017-01-01"
      }, {
        label: "2017-01-02 00:00:00",
        value: "2017-01-02"
      }, {
        label: "2017-01-03 00:00:00",
        value: "2017-01-03"
      }, {
        label: "2017-01-04 00:00:00",
        value: "2017-01-04"
      }, {
        label: "2017-01-05 00:00:00",
        value: "2017-01-05"
      }, {
        label: "2017-01-06 00:00:00",
        value: "2017-01-06"
      }, {
        label: "2017-01-07 00:00:00",
        value: "2017-01-07"
      }, {
        label: "2017-01-08 00:00:00",
        value: "2017-01-08"
      }]

      $scope.args = {}

      $scope.refresh = function () {
        var params = {
          campaign: "haizeiwang"
        }

        if ($scope.args.selectDate) {
          params.start = new Date($scope.args.selectDate).getTime();
          params.end = new Date($scope.args.selectDate).getTime() + 24 * 3600 * 1000;
        }
        console.log(params)
        GameDataService.getEventStatistics(params)
          // GameDataService.getEventStatistics("crazyrabbit")
          .then(function (data) {
            console.log(data)
            $scope.data = data;
          }, function (error) {
            console.log(error)
          })
      }

      $scope.refresh()



    }
  ]);