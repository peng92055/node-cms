'use strict';

angular
  .module('exe.cms.user')
  .factory('AppAuth', function($rootScope, $cookies, $http, $q, APP_CONFIG, EXEAuth, User) {

    var TWO_WEEKS = 1000 * 60 * 60 * 24 * 7 * 2
    var COOKIE_TOKEN = "accessToken"

    //console.log(EXEAuth)

    var self = {
      TWO_WEEKS: TWO_WEEKS,

      login: function(credentials) {

        var deferred = $q.defer()
        User.login({
            incluide: 'user',
            remember: credentials.rememberMe
          },
          credentials,
          function(response) {
            //console.log(response)
            
            if(response.user){
              var userData = {
                id: response.userId,
                name: response.user.username,
                email: response.user.email
              }
            }

            EXEAuth.setUser(response.id, response.userId, userData);
            EXEAuth.rememberMe = credentials.rememberMe !== false;
            EXEAuth.save();

            $cookies.put(COOKIE_TOKEN, response.id)

            deferred.resolve(response.user)
          },
          function(error) {
            console.log('Login error: ', arguments);
            EXEAuth.clearUser()
            deferred.reject(error)
          })

        return deferred.promise
      },

      logout: function() {
        var deferred = $q.defer()
        if (!EXEAuth.accessToken) {
          self.clear()
          deferred.resolve()
        }
        User.logout({ 'access_token': EXEAuth.accessToken }, function() {
          self.clear()
          deferred.resolve()
        })

        return deferred.promise
      },

      clear: function() {
        EXEAuth.clearUser()
        EXEAuth.clearStorage()

        $cookies.remove(COOKIE_TOKEN)
      },

      getCurrentUser: function() {
        var deferred = $q.defer()

        if (EXEAuth.currentUserData) {
          deferred.resolve(EXEAuth.currentUserData)
        } else {
          User.getCurrent(function(result) {
            console.log(result)
            EXEAuth.currentUserData = result;
            deferred.resolve(EXEAuth.currentUserData)
          })
        }

        return deferred.promise

      }
    }

    return self
  })

// .factory('NeedAuthHttpInterceptor', function(EXEAuth, $q) {
//   return {
//     request: function(config) {
//       if (!EXEAuth.isLoggedIn()) {
//         var canceller = $q.defer();
//         config.timeout = canceller.promise;
//         EXEAuth.gotoLogin()
//       }
//       // Return the config or wrap it in a promise if blank.
//       return config || $q.when(config);
//     }
//   };
// })

// .config(['$httpProvider', function($httpProvider) {
//   $httpProvider.interceptors.push('NeedAuthHttpInterceptor');
// }])

.run(function($rootScope, $timeout, EXEAuth) {
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      if (toState.passAuth) {
        return
      }
      if (!EXEAuth.isLoggedIn()) {

        event.preventDefault()
        $timeout(function(){
          EXEAuth.gotoLogin()
        })
        return false
      }
    })
})
;
