(function() {
  'use strict';
  angular
    .module('exe.cms.marketing.events')
    .service('EventsService', function($state, Event, $http, $q, APP_CONFIG) {

      this.EVENT_STATUS = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      }

      var API_Stores = APP_CONFIG.storeServer + '/rest/opticalstore/';
      this.getStores =  function(){
        var deferred = $q.defer();
        $http.get(API_Stores).then(function(response) {
          if (response.status == 200) {
            deferred.resolve(response.data)
          } else{
            deferred.reject('Error in loading stores')
          }
        })
        return deferred.promise;
      }

      this.getEvents = function() {
        return Event.find({
          'filter[order]': 'id DESC'
        }).$promise;
      };

      this.getEvent = function(id) {
        return Event.findById({
          id: id
        }).$promise;
      };

      this.upsertEvent = function(event) {
        return Event.upsert(event).$promise
          .then(function() {
            // CoreService.toastSuccess(
            //   gettextCatalog.getString('Event saved'),
            //   gettextCatalog.getString('Your event is safe with us!')
            // );
          })
          .catch(function(err) {
            // CoreService.toastSuccess(
            //   gettextCatalog.getString('Error saving event '),
            //   gettextCatalog.getString('This event could no be saved: ') + err
            // );
          });
      };

      this.deleteEvent = function(id, successCb, cancelCb) {
        // CoreService.confirm(
        //   gettextCatalog.getString('Are you sure?'),
        //   gettextCatalog.getString('Deleting this cannot be undone'),
        //   function() {
        //     Event.deleteById({ id: id }, function() {
        //       CoreService.toastSuccess(
        //         gettextCatalog.getString('Event deleted'),
        //         gettextCatalog.getString('Your event is deleted!'));
        //       successCb();
        //     }, function(err) {
        //       CoreService.toastError(
        //         gettextCatalog.getString('Error deleting event'),
        //         gettextCatalog.getString('Your event is not deleted! ') + err);
        //       cancelCb();
        //     });
        //   },
        //   function() {
        //     cancelCb();
        //   }
        // );
      };

      this.getFormFields = function() {
        return [{
          key: 'name',
          type: 'input',
          templateOptions: {
            label: '名称',
            required: true
          }
        }, {
          key: 'description',
          type: 'textarea',
          templateOptions: {
            label: '说明',
            required: true
          }
        }, {
          key: 'url',
          type: 'input',
          templateOptions: {
            label: '链接',
            required: true
          }
        }, {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: '标题'
          }
        }, {
          key: 'wx_title',
          type: 'input',
          templateOptions: {
            label: '微信分享标题'
          }
        }, {
          key: 'wx_desc',
          type: 'textarea',
          templateOptions: {
            label: '微信分享副标题'
          }
        }, {
          key: 'img_share',
          type: 'image-qiniu',
          templateOptions: {
            label: '分享图片',
            size: {
              width: 100
            }
          }
        }, {
          key: 'img_banner',
          type: 'image-qiniu',
          templateOptions: {
            label: 'Banner图片',
            size: {
              width: 400
            }
          }
        }, {
          key: 'img_qrcode',
          type: 'image-qiniu',
          templateOptions: {
            label: '二维码图片',
            size: {
              width: 200
            }
          }
        }, {
          key: 'img_rules',
          type: 'image-qiniu',
          templateOptions: {
            label: '活动规则图片',
            size: {
              width: 400
            }
          }
        }, {
          key: 'marketing_id',
          type: 'input',
          templateOptions: {
            label: 'Marketing_id'
          }
        }, {
          key: 'status',
          type: 'select',
          templateOptions: {
            label: '状态',
            required: true,
            options: [{
              name: '未开始',
              value: 0
            }, {
              name: '进行中',
              value: 1
            }, {
              name: '已结束',
              value: 2
            }]
          }
        }, {
          "type": "jfcheckbox",
          "key": "withAds",
          "templateOptions": {
            "label": "是否添加介绍内容",
            "values": [true, false]
          }
        }]
      };

    })
    .filter('eventStatus', function(EventsService) {
      return function(input) {
        return EventsService.EVENT_STATUS[input];
      };
    });

})();
