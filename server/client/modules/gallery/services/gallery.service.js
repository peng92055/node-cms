(function() {
  'use strict';
  angular
    .module('exe.experience.gallery')
    .service('GalleryService', function($state, $http, $q, APP_CONFIG) {

      this.getTheme = function(){
        return $http.get(APP_CONFIG.apiUrl + "/gallery/theme");
      }

      this.getSeriesById = function(series_id){
        series_id = parseInt(series_id);
        var deferred = $q.defer();
        $http.get(APP_CONFIG.apiUrl + "/gallery/series").then(function(result){
          if(result.data && result.data.length>1){
            var seriesInfo = {};
            for(let i = 0;i<result.data.length;i++){
              if(result.data[i].id == series_id){
                seriesInfo = result.data[i];
                break;
              }
            }
            deferred.resolve(seriesInfo);
          }
        })

        return deferred.promise;
      }

      this.getSeriesByThemeId = function(theme_id){
      	theme_id = parseInt(theme_id);
      	var deferred = $q.defer();
      	$http.get(APP_CONFIG.apiUrl + "/gallery/series").then(function(result){
      		if(result.data && result.data.length>1){
      			var series = [];
      			angular.forEach(result.data,function(item){
      				if(item.theme_ids.indexOf(theme_id) != -1){
      					series.push(item);
      				}
      			})
      			deferred.resolve(series);
      		}
      	})

      	return deferred.promise;
      }

      this.getGlassesBySeriesId = function(series_id){
        series_id = parseInt(series_id);
        var deferred = $q.defer();
        $http.get(APP_CONFIG.apiUrl + "/gallery/list").then(function(result){
          if(result.data && result.data.length>1){
            var glasses = [];
            angular.forEach(result.data,function(item){
              if(item.series_id.indexOf(series_id) != -1){
                glasses.push(item);
              }
            })
            deferred.resolve(glasses);
          }
        })

        return deferred.promise;
      }

      this.getIndexSeries = function(){
        return $http.get(APP_CONFIG.apiUrl + "/gallery/index");
      }
    })

})();
