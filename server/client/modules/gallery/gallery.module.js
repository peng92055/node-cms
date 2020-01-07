"use strict";

angular.module('exe.experience.gallery', [])

.config(function($stateProvider) {
  $stateProvider
  .state('experience.gallery', {
    abstract: true,
    url: '/gallery',
    data: {
      title: '竞技台'
    },
    views: {
      "content@experience": {
        templateUrl: 'modules/gallery/views/main.tpl.html'
      }
    }
  })
  .state('experience.gallery.theme', {
    url: '',
    templateUrl: 'modules/gallery/views/theme_list.tpl.html',
    controllerAs: 'ctrl',
    controller: function($scope, theme, $state, $stateParams) {
      $scope.pageClass = 'page-theme';
      this.theme = theme.data;
      setTimeout(function(){
        new Swiper("#themeSwiperContainer",{
          pagination: '.swiper-pagination',
          loop: true,
          autoplay: 5000,
          lazyLoading: true,
          preloadImages: false,
          lazyLoadingInPrevNext: true,
          autoplayDisableOnInteraction: false
        })
      },0)

      $scope.linkToTheme = function(theme_id, series_id){
        $stateParams.id = theme_id;
        $stateParams.series_id = series_id;
        $state.go("experience.gallery.series.theme", $stateParams)
      }
    },
    resolve: {
      theme: function($stateParams,GalleryService) {
        // return GalleryService.getTheme();
        return GalleryService.getIndexSeries();
      }
    }
  })
  //通过首页为主题，导航进入相应主题详情的路由
  .state('experience.gallery.series', {
    url: '/theme/:id',
    templateUrl: 'modules/gallery/views/theme.tpl.html',
    controller: "seriesCtrl"
  })
  //通过首页为系列，导航进入相对应主题的路由
  .state('experience.gallery.series.theme', {
    url: '/series/:series_id',
    templateUrl: 'modules/gallery/views/theme.tpl.html',
    controller: "seriesCtrl"
  })
  .state('experience.gallery.glasses', {
    url: '/series/:id',
    params: {
      'selecedCompare': null
    },
    views: {
      '':{
        templateUrl: 'modules/gallery/views/glasses.tpl.html',
        controller: 'glassesCtrl'
      },
      'detail@experience.gallery.glasses': {
        templateUrl: 'modules/gallery/views/glasses_detail.tpl.html'
      }
    },
    resolve: {
      glassesList: function($stateParams,GalleryService) {
        return GalleryService.getGlassesBySeriesId($stateParams.id);
      },
      seriesInfo: function($stateParams,GalleryService){
        return GalleryService.getSeriesById($stateParams.id)
      }
    }
  })
  .state('experience.gallery.glasses.compare', {
    url: '/compare',
    views: {
      'detail@experience.gallery.glasses': {
        templateUrl: 'modules/gallery/views/glasses_compare.tpl.html',
        controller: 'glassesCompareCtrl'
      }
    }
  })
})
