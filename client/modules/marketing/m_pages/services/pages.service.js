(function() {
  'use strict';
  angular
    .module('exe.cms.marketing.m-pages')
    .service('MPagesService', function($state, $http, $q, MarketingPages, MarketingPagesRecord, APP_CONFIG) {

      this.MARKETING_PAGE_STATUS = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      }

      this.SMSTYPE = {
        SEND_COUPON: 'SEND_COUPON',
        SEND_OPTOMETRY: 'SEND_OPTOMETRY',
        SEND_VR: 'SEND_VR',
        SEND_STARBUCKS: 'SEND_STARBUCKS',
        SEND_TAXI: 'SEND_TAXI',
        SEND_LENS_100: 'SEND_LENS_100',
        SEND_NEW_YEAR: 'SEND_NEW_YEAR',
        SMS_CODE_SIGNLE_DOG_DAY: 'SMS_CODE_SIGNLE_DOG_DAY',
        SEND_WOMEN_DAY: 'SEND_WOMEN_DAY'
      }

      this.getPages = function(limit, page, filter) {
        var _filter = {
          'filter[order]': 'id DESC',
          'filter[where][type]': 'm',
          'filter[where][document_status][neq]': 5,
          'limit': limit || 10,
          'page': page || 1
        }
        angular.merge(_filter, filter)
        return MarketingPages.query(_filter).$promise
      };

      this.getPage = function(id) {
        return MarketingPages.findById({
          id: id
        }).$promise;
      };

      this.getPageRecordByPageId = function(page_id, successCb, cancelCb) {
        MarketingPagesRecord.find({ 'filter[order]': 'id DESC', 'filter[where][page_id]': page_id }, function(records) {
          successCb(records);
        }, function(error) {
          cancelCb(error);
        })
      }

      this.upsertPage = function(page) {
        var deferred = $q.defer();

        if (page.id) {
          MarketingPages.findById({ id: page.id }, function(page_db) {
            if (angular.equals(page_db, page)) {
              deferred.resolve(page);
            } else {
              upsert();
            }
          })
        } else {
          upsert();
        }

        function upsert() {
          page['document_status'] = 1; //草稿状态
          MarketingPages.upsert(page, function(result) {
            deferred.resolve(result);
          }, function(err) {
            deferred.reject(err);
          })
        }
        return deferred.promise;
      };

      this.publishPage = function(page, successCb, cancelCb) {
        $http.post(APP_CONFIG.apiUrl + "/marketingPages/publish", { "page_id": page.id, "type": page.type }).then(function(result) {
          if (result.data.publish) {
            page['document_status'] = 3; //发布状态
            page['publish_url'] = page['url'];
            MarketingPages.upsert(page, function() {
              successCb();
            }, function(err) {
              cancelCb();
            });
          } else {
            cancelCb();
          }
        })
      }

      this.batchPublishPage = function(pagesArr, resultCb) {
        var paramArr = [];
        for (var i = 0; i < pagesArr.length; i++) {
          var itemParam={}
          itemParam.page_id = pagesArr[i].id;
          itemParam.type = pagesArr[i].type;
          delete pagesArr[i]['selected'];
          paramArr.push(itemParam);
        }
        $http.post(APP_CONFIG.apiUrl + "/marketingPages/batchpublish", { "pagesArr": paramArr }).then(function(result) {
          var allPromiseArr = [];
          for (var i = 0; i < result.data.length; i++) {
            var itemPromise = new Promise(function(resolve, reject) {
              if (result.data[i].publish) {
                pagesArr[i]['document_status'] = 3; //发布状态
                pagesArr[i]['publish_url'] = pagesArr[i]['url'];
                MarketingPages.upsert(pagesArr[i], function() {
                  resolve('upsert_success');
                }, function(err) {
                  resolve(err);
                });
              } else {
                resolve('upsert_fail')
              }
            });
            allPromiseArr.push(itemPromise);
          }
          Promise.all(allPromiseArr).then(function(result) {
            resultCb(result);
          })
        })
      };

      this.copyPage = function(page, successCb, cancelCb) {
        var page = angular.copy(page);
        delete page['id'];
        delete page['created'];
        delete page['modified'];
        delete page['publish_url'];
        page.name = page.name + "-复制版";
        page.url = "copy_" + page.url;
        page['document_status'] = 1; //草稿状态
        MarketingPages.upsert(page, function() {
          successCb();
        }, function(err) {
          cancelCb();
        });
      }

      this.deletePage = function(page, successCb, cancelCb) {
        $http.post(APP_CONFIG.apiUrl + "/marketingPages/delete", { "page_id": page.id, "type": page.type }).then(function(result) {
          if (result.data.delete) {
            page['document_status'] = 5; //删除状态
            delete page['publish_url'];
            MarketingPages.upsert(page, function() {
              successCb();
            }, function(err) {
              cancelCb();
            });
          } else {
            cancelCb();
          }
        })
      }

      this.disablePage = function(page, successCb, cancelCb){
        $http.post(APP_CONFIG.apiUrl + "/marketingPages/delete", { "page_id": page.id, "type": page.type }).then(function(result) {
          if (result.data.delete) {
            page['document_status'] = 1; //设置为草稿状态
            page['publish_url'] = "";
            MarketingPages.upsert(page, function() {
              successCb();
            }, function(err) {
              cancelCb();
            });
          } else {
            cancelCb();
          }
        })
      }

      this.enablePage = function(page, successCb, cancelCb){
        MarketingPages.upsert(page, function() {
          successCb();
        }, function(err) {
          cancelCb();
        });
      }


      this.getPagesByUrl = function(url) {
        return MarketingPages.find({ 'filter[where][url]': url }).$promise;
      }

      this.PercentageReference = {
        "0.0625": "6.25%",
        "0.125": "12.5%",
        "0.1875": "18.75%",
        "0.25": "25%",
        "0.3125": "31.25%",
        "0.375": "37.5%",
        "0.4375": "43.75%",
        "0.5": "50%",
        "0.5625": "56.25%",
        "0.625": "62.5%",
        "0.6875": "68.75%",
        "0.75": "75%",
        "0.8125": "81.25%",
        "0.875": "87.5%",
        "0.9375": "93.75%",
        "1": "100%"
      }

      this.BlockSelectList = [{
        "type": "common_head",
        "desc": "通用头部模块，模块中可选元素：1、单张背景图或者完全重叠的两张背景图；2、主要按钮；3、倒计时；4、副标题；5、按钮两旁的gif。",
        "onlyone": true,
        "thumbnail": "../../../assets/img/block-select-template1.png"
      }, {
        "type": "common_template",
        "desc": "通用模块，模块主要由图片组成，图片位置以行元素划分，每行最多支持5列。图片可以有三种事件:1、与主要行为一直；2、跳转页面；3、自定义滚动到block顶部。",
        "onlyone": false,
        "thumbnail": "../../../assets/img/block-select-template4.png"
      }, {
        "type": "store_intro_slider",
        "desc": "门店模块，模块中元素暂时固定。",
        "onlyone": true,
        "thumbnail": "../../../assets/img/block-select-template5.png"
      }, {
        "type": "store_intro_map",
        "desc": "门店模块，使用地图样式来介绍每个门店的位置与详情",
        "onlyone": true,
        "thumbnail": "../../../assets/img/block-select-template6.png"
      }, {
        "type": "contact",
        "desc": "联系模块，模块中元素固定。背景色固定为白色，暂不支持更改背景色。上下距离为25px和60px",
        "onlyone": true,
        "thumbnail": "../../../assets/img/block-select-template3.png",
        "placeholder": "暂时不支持自定义样式，背景色固定为白色，上下距离为25px和60px。"
      }, {
        "type": "bottom_bar",
        "desc": "底部悬浮按钮，模块中元素包括标题和副标题。可配置颜色，背景色。",
        "onlyone": true,
        "thumbnail": "../../../assets/img/block-select-template2.png"
      }]

      this.BlockTranslate = {
        "common_head": "首屏模块",
        "common_template": "通用模块",
        "store_intro_slider": "门店模块",
        "contact": "联系模块",
        "bottom_bar": "底部悬浮按钮",
        "store_intro_map": "门店地图介绍模块"
      }

      this.getFormFields = function() {
        return [{
          key: 'name',
          type: 'input',
          templateOptions: {
            label: '名称',
            required: true
          }
        }, {
          key: 'url',
          type: 'input',
          templateOptions: {
            label: '页面路径',
            required: true,
            maxlength: 30,
            minlength: 6,
            placeholder: '6到30位，只能由数字、字母、小数点和下横线组成，以.html结尾。例如：test.html'
          },
          validators: {
            url: {
              expression: function(viewValue, modelValue) {
                var value = modelValue || viewValue;
                return /^[a-zA-Z0-9_-]+(\.html+)+$/.test(value);
              },
              message: '$viewValue + " is not a valid url Address"'
            }
          }
        }, {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: '页面标题',
            required: true
          }
        }, {
          key: 'marketing_id',
          type: 'input',
          templateOptions: {
            required: true,
            label: 'Marketing_id'
          }
        }, {
          key: 'track_tag',
          type: 'input',
          templateOptions: {
            required: true,
            label: '跟踪前缀'
          }
        }, {
          key: 'need_verify',
          type: 'radio',
          templateOptions: {
            label: '是否需要审核',
            required: true,
            options: [{
              name: '是',
              value: true
            }, {
              name: '否',
              value: false
            }]
          }
        }, {
          key: 'need_footer',
          type: 'radio',
          templateOptions: {
            label: '是否需要统一尾部',
            required: true,
            options: [{
              name: '是',
              value: true
            }, {
              name: '否',
              value: false
            }]
          }
        }, {
          key: 'person_cnt_type',
          type: 'select',
          templateOptions: {
            label: '页面人数自增类型',
            required: false,
            options: [{
              name: '不需要',
              value: ""
            }, {
              name: '预约人数（夸张版）',
              value: "appointment"
            }, {
              name: '预约人数（接近版）',
              value: "appointment_real"
            }, {
              name: '抢购人数（夸张版，每日增数是预约10倍）',
              value: "seckilling"
            }]
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
        }]
      };

      //获取微信分享字段
      this.getFormWXShareFields = function() {
        return [{
          key: 'title',
          type: 'input',
          templateOptions: {
            required: false,
            label: '分享标题'
          }
        }, {
          key: 'desc',
          type: 'input',
          templateOptions: {
            required: false,
            label: '分享正文'
          }
        }, {
          key: 'imgUrl',
          type: 'image-qiniu',
          templateOptions: {
            label: '分享头图（建议300*300）',
            size: {
              width: 100
            }
          }
        }, {
          key: 'link',
          type: 'input',
          templateOptions: {
            required: false,
            label: '分享链接',
            placeholder: '默认为当前配置的页面链接(选填)'
          }
        }]
      }

      //jfweb已配置的marketing/* 链接列表
      this.jfwebLinks = [
        "/freeframe",
        "/freeframe/b",
        "/freeframe/c",
        "/freeframe/d",
        "/freeframe/e",
        "/freeframe/appointment",
        "/freeframe/g",
        "/freeframe/g2",
        "/freeframe/titanium",
        "/freeframe/i",
        "/freeframe/i2",
        "/freeframe/k",
        "/freeframe/l",
        "/freeframe/l2",
        "/lmm/appointment",
        "/warcraft/wow_tickets",
        "/plate/a",
        "/plate/a/products",
        "/plate/b",
        "/essilor",
        "/essilor/b",
        "/essilor/c",
        "/qcxb"
      ]

    })
    .filter('pageStatus', function(MPagesService) {
      return function(input) {
        return MPagesService.MARKETING_PAGE_STATUS[input];
      };
    });

})();
