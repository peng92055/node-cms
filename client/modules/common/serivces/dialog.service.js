(function () {
  'use strict';
  angular
    .module('exe.cms.common')
    .service('Dialog', function ($q) {
      
      var defaultSweetOpts = {
        title: "Are you sure?",
        text: "You will really do this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, do it!",
        cancelButtonText: "No, cancel!"
      }

      this.openConfirm = function(opts) {
        var deferred = $q.defer();

        var options = angular.copy(defaultSweetOpts);
        opts = opts || {};
        angular.extend(options, opts);

        swal(options).then(function(){
          deferred.resolve();
        },function(dismiss){
          if (dismiss === 'cancel') {
            deferred.reject();
          }
        });
        return deferred.promise;
      }
    })

})();
