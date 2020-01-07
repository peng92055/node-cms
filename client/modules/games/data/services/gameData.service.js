(function () {
  'use strict';
  angular
    .module('exe.cms.games.data')
    .service('GameDataService', function ($state, $http, $q, APP_CONFIG) {

      var API_Games = APP_CONFIG.apiUrl + '/store/games'

      this.getEventStatistics = function (params) {
        var deferred = $q.defer()
        var url = API_Games + "/event?campaign=" + params.campaign;
        if (params.start && params.end) {
          url += "&start=" + params.start + "&end=" + params.end;
        }
        $http.get(url)
          .then(function (result) {
            var data = mapData(result.data)
            deferred.resolve(data)
          }, function (error) {
            console.log(error);
            deferred.reject(error)
          })


        return deferred.promise
      }

      function mapData(data) {
        var result = {}
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i]
          result[dataItem.event_action] = dataItem;
        }

        return result;
      }

    })

})();