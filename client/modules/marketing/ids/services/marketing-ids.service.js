(function() {
  'use strict';
  angular
    .module('exe.cms.marketing.ids')
    .service('MarketingsService', function($state, $http, $q, APP_CONFIG) {

      var API_Marketings = APP_CONFIG.apiUrl + '/store/marketings'

      var cache

      this.getMarketings = function(params) {
        var deferred = $q.defer();
        if(!params){
          params = {};
        }

        params.limit = params.limit || 20;
        params.page = params.page || 1;
        $http.get(API_Marketings+"?limit="+params.limit+"&page="+params.page).then(function(response) {
          if (response.status == 200) {
            cache = response.data;
            deferred.resolve(cache)
          }
          deferred.reject('Error in loading marketings')
        })

        return deferred.promise;
      };

      this.getMarketing = function(id) {
        var deferred = $q.defer();
        if (cache) {
          deferred.resolve(getMarketingById(id))
        } else {
          this.getMarketings().then(function() {
            deferred.resolve(getMarketingById(id))
          })
        }

        return deferred.promise
      };

      function getMarketingById(id) {
        for (var i = 0, l = cache.data.length; i < l; i++) {
          if (cache.data[i].marketing_id == id) {
            return cache.data[i]
          }
        }
      }

      this.updateMarketing = function(marketing) {
        var deferred = $q.defer();

        formatBeforeSubmit(marketing)

        $http.put(API_Marketings + '?marketing_id=' + marketing.marketing_id, marketing).then(function(response) {
          // CoreService.toastSuccess(
          //   'Marketing保存成功'
          // );
          deferred.resolve(response.data)
        })

        return deferred.promise
      };

      this.createMarketing = function(marketing) {
        var deferred = $q.defer()

        formatBeforeSubmit(marketing)

        $http.post(API_Marketings, marketing).then(function(response) {
          deferred.resolve(response.data)
        })

        return deferred.promise
      };

      function formatBeforeSubmit(marketing) {
        if (marketing.start_time && typeof marketing.start_time == 'object') {
          marketing.start_time = marketing.start_time.getTime()
        }
        if (marketing.end_time && typeof marketing.end_time == 'object') {
          marketing.end_time = marketing.end_time.getTime()
        }

        marketing.use_for_sale = marketing.use_for_sale ? 1 : 0
        marketing.use_for_appointment = marketing.use_for_appointment ? 1 : 0

      }

      // this.deleteMarketing = function(id, successCb, cancelCb) {
      //   CoreService.confirm(
      //     gettextCatalog.getString('Are you sure?'),
      //     gettextCatalog.getString('Deleting this cannot be undone'),
      //     function() {
      //       successCb();
      //     },
      //     function() {
      //       cancelCb();
      //     }
      //   );
      // };

      this.getFormFields = function() {
        return [{
          key: 'name',
          type: 'input',
          templateOptions: {
            label: '名称',
            required: true
          }
        }, {
          key: 'marketing_id',
          type: 'jfinput',
          templateOptions: {
            label: 'Marketing ID (自动生成)',
            disabled: true
          }
        }, {
          key: 'description',
          type: 'textarea',
          templateOptions: {
            label: '说明'
          }
        }, {
          "type": "jfcheckbox",
          "key": "use_for_appointment",
          "templateOptions": {
            "label": "用于预约",
            "values": [1, 0]
          }
        }, {
          "type": "jfcheckbox",
          "key": "use_for_sale",
          "templateOptions": {
            "label": "用于销售"
          }
        }, {
          "key": "start_time",
          "type": "uib-datepicker",
          "templateOptions": {
            "label": "开始日期",
            "type": "text",
            "datepickerPopup": "dd-MMMM-yyyy",
            datepickerOptions: {
              format: 'yyyy-MM-dd'
            }
          }
        }, {
          "key": 'start_time1',
          type: 'uib-timepicker',
          templateOptions: {
            label: '开始时间'
          }
        }, {
          key: 'end_time',
          type: 'uib-datepicker',
          templateOptions: {
            label: '结束日期',
            "type": "text",
            "datepickerPopup": "dd-MMMM-yyyy",
            datepickerOptions: {
              format: 'yyyy-MM-dd'
            }
          }
        }, {
          key: 'end_time1',
          type: 'uib-timepicker',
          templateOptions: {
            label: '结束时间'
          }
        }, {
          key: 'campaign_url',
          type: 'input',
          templateOptions: {
            label: '广告链接'
          }
        }, {
          key: 'utm_campaign',
          type: 'input',
          templateOptions: {
            label: '广告名称'
          }
        }]
      };

    })

})();
