(function() {
  'use strict';
  angular
    .module('exe.cms.hotlists')
    .service('HotlistService', function($state, Hotlist) {


      this.getHotlists = function() {
        return Hotlist.find().$promise;
      };

      this.getHotlistWithProducts = function(id) {
        return Hotlist.findById({
          id: id,
          // 'filter[include]': 'products'
        }).$promise;
      }

      this.getHotlist = function(id) {
        return Hotlist.findById({
          id: id
        }).$promise;
      };

      this.upsertHotlist = function(hotlist) {

        return Hotlist.upsert(hotlist).$promise
          .then(function() {
            // CoreService.toastSuccess(
            //   "保存成功"
            // );
          })
          .catch(function(err) {
            // CoreService.toastSuccess(
            //   '保存失败',
            //   err
            // );
          });
      };

      this.deleteHotlist = function(id, successCb, cancelCb) {
        // CoreService.confirm(
        //   gettextCatalog.getString('Are you sure?'),
        //   gettextCatalog.getString('Deleting this cannot be undone'),
        //   function() {
        //     Hotlist.deleteById({ id: id }, function() {
        //       CoreService.toastSuccess(
        //         gettextCatalog.getString('Hotlist deleted'),
        //         gettextCatalog.getString('Your Hotlist is deleted!'));
        //       successCb();
        //     }, function(err) {
        //       CoreService.toastError(
        //         gettextCatalog.getString('Error deleting Hotlist'),
        //         gettextCatalog.getString('Your Hotlist is not deleted! ') + err);
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
          },
          // {
          //   key: 'url',
          //   type: 'input',
          //   templateOptions: {
          //     label: '链接',
          //     required: true
          //   }
          // },
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: '标题'
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
            key: 'status',
            type: 'select',
            templateOptions: {
              label: '状态',
              required: true,
              options: [{
                name: '未启用',
                value: 0
              }, {
                name: '启用',
                value: 1
              }]
            }
          }, {
            "template": "<hr />"
          }, {
            fieldGroup: [{
              key: 'wx_title',
              type: 'input',
              templateOptions: {
                label: '微信分享标题'
              }
            }, {
              key: 'wx_desc',
              type: 'input',
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
            }]
          }

        ]
      };

    })

})();
