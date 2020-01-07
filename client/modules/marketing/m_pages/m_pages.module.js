(function() {
  'use strict';
  angular.module('exe.cms.marketing.m-pages', [])

  .config(function($stateProvider) {
    $stateProvider
      .state('cms.marketingMPages', {
        abstract: true,
        url: '/marketing/m/pages',
        data: {
          title: 'M站营销页'
        },
        views: {
          "content@cms": {
            templateUrl: 'modules/marketing/m_pages/views/main.tpl.html'
          }
        }
      })
      .state('cms.marketingMPages.list', {
        url: '',
        templateUrl: 'modules/marketing/m_pages/views/list.tpl.html',
        controller: 'MPageListCtrl'
      })
      .state('cms.marketingMPages.add', {
        url: '/add',
        templateUrl: 'modules/marketing/m_pages/views/form.tpl.html',
        data: {
          title: '添加M站营销页'
        },
        controllerAs: 'ctrl',
        controller: 'MPageCtrl',
        resolve: {
          page: function() {
            return {
              'type': 'm',
              'status': 1,
              'need_footer': true,
              'need_verify': false,
              'person_cnt_type': 'appointment',
              'primary_actions': [{
                "type": "appointment_dialog",
                "percentage": "1",
                "opts": {
                  "first": {
                    "title": "只需1步，获取0元镜架",
                    "title_color": "#000000",
                    "btn_text_color": "#ffffff",
                    "btn_text": "领 取 0 元 镜 架 券",
                    "btn_bg_color": "#f74249"
                  },
                  "second": {
                    "title": "立即验证 领取0元镜架券",
                    "title_color": "#000000",
                    "btn_text_color": "#ffffff",
                    "desc": "<p>1、免费尊享<strong>全效眼检</strong><span>+</span><strong>九段验光</strong>一次</p><p>2、免费获得<strong>全场0元镜架券</strong>一张</p>",
                    "btn_text": "返 回 验 证 手 机",
                    "btn_bg_color": "#f74249"
                  },
                  "confirm_args": {
                    "sms_template": "SEND_COUPON"
                  }
                }
              }],
              'block_array': [],
              'operating_history': [],
              'document_status': 1//草稿状态
            };
          }
        }
      })
      .state('cms.marketingMPages.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/marketing/m_pages/views/form.tpl.html',
        data: {
          title: '编辑M站营销页'
        },
        controllerAs: 'ctrl',
        controller: 'MPageCtrl',
        resolve: {
          page: function($stateParams, MPagesService) {
            return MPagesService.getPage($stateParams.id);
          }
        }
      })
      .state('cms.marketingMPages.view', {
        url: '/:id',
        templateUrl: 'modules/marketing/m_pages/views/view.tpl.html',
        controllerAs: 'ctrl',
        controller: function(page) {
          this.page = page;
        },
        resolve: {
          page: function($stateParams, MPagesService) {
            return MPagesService.getPage($stateParams.id);
          }
        }
      });
  })

  .run(function($rootScope) {
    //$rootScope.addMenu('M站营销页', 'app.marketingMPages.list', 'fa-tags', 'marketingPages', 'marketing');
  });
})();
