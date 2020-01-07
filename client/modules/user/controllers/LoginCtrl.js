"use strict";

angular.module('exe.cms.user')
  .controller('LoginCtrl', ['$scope', '$state', '$location', 'AppAuth', 'User',
    function($scope, $state, $location, AppAuth, User) {


      $scope.credentials = {
        ttl: AppAuth.TWO_WEEKS,
        rememberMe: true
      };

      $scope.doLogin = function() {
        AppAuth.login($scope.credentials)
          .then(function(data) {
            if (data.error) {
              console.log(data.error.msg);
            } else {
              var next = $location.nextAfterLogin || '/';
              $location.nextAfterLogin = null;
              if (next === '/login') {
                next = '/';
              }
              $location.path(next);
            }
          });
      }

    }
  ]);
