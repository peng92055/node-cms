(function() {

  'use strict';
  angular.module('exe.cms.hotlists')

  .controller('HotlistCtrl', ['$scope', '$state', 'HotlistService', 'ProductService', 'hotlist',
    function($scope, $state, HotlistService, ProductService, hotlist) {

      $scope.hotlist = hotlist
      $scope.formFields = HotlistService.getFormFields()

      $scope.formOptions = {}


      function init(){
        if($scope.hotlist.products){
          $scope.hotlist.product_ids = getProductIds()
        }
      }

      init()

      $scope.updateProducts = function(){

        ProductService.getProductByIds($scope.hotlist.product_ids).then(
          function(result){
            $scope.products = result.data
            setHotlistProduct($scope.products)
          }
        )
      }


      $scope.submit = function() {
        HotlistService.upsertHotlist($scope.hotlist).then(function() {
          $state.go('^.list')
        });
      };


      function getProductIds(){
        var productIds_arr = []
        _.each($scope.hotlist.products, function(product, index){
          productIds_arr.push(product.product_id)
        })

        return productIds_arr.join(',')
      }


      function setHotlistProduct(products){
        $scope.hotlist.products = []
        _.each(products, function(product, index){
          $scope.hotlist.products.push({
            product_id: product.product_id,
            img_url: product.image_url,
            name: product.name,
            index: index,
            hotrate: product.sales
          })
        })
      }

    }
  ])

})();
