(function() {

  'use strict';
  angular.module('exe.cms.marketing.m-pages')

  .controller('MPageListCtrl', ['$scope', '$state', 'MPagesService', 'Dialog', 'APP_CONFIG', '$location', 
    function($scope, $state, MPagesService, Dialog, APP_CONFIG, $location){

      $scope.enablePages = {
        pagination: {
          currentPage: $location.search().page || 1,
          limit: $location.search().limit || 10,
          filter: {
            'filter[where][status][neq]' : 2
          }
        }        
      }

      $scope.disablePages = {
        pagination: {
          currentPage: $location.search().page || 1,
          limit: $location.search().limit || 10,
          filter: {
            'filter[where][status]' : 2
          }
        } 
      }

      $scope.setting = {
        currentView: 'enablePages',
        isMulti: false
      }

      //单个页面发布
      $scope.publish = function(page) {
        swal({
          title: "确定要发布页面吗",
          text: "待发布页面：" + page.name,
          type: "info",
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: '发 布',
          cancelButtonText: '我再想想',
          preConfirm: function() {
            return new Promise(function(resolve) {
              MPagesService.publishPage(page, function() {
                setTimeout(function() {
                  sweetAlert("成功", "发布成功!", "success");
                  reloadPages();
                }, 1000)
              }, function() {
                sweetAlert("失败", "发布失败，请刷新重试!", "error");
                reloadPages();
              });
            });
          }
        }).then(function() {}, function() {})
      }

      // 批量页面发布
      $scope.batchPublish = function() {
        var pagesArr = []; //用来存放所选择的页面
        angular.forEach($scope.enablePages.pages, function(item) {
          if (!!item.selected) {
            pagesArr.push(item);
          }
        });
        if (pagesArr.length < 1) {
          swal({
            title: "请选择你要发布的页面",
            confirmButtonText: '确定'
          })
          return false;
        }
        swal({
          title: "确定要发布页面吗",
          text: "所选页面：" + pagesArr.length + "个",
          type: "info",
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: '发 布',
          cancelButtonText: '我再想想',
          preConfirm: function() {
            return new Promise(function(resolve) {
              MPagesService.batchPublishPage(pagesArr, function(res) {
                var resultText = "";
                setTimeout(function() {
                  for (var i = 0; i < res.length; i++) {
                    if (res[i] == "upsert_success") {
                      resultText += "<div class='has-success'><label>" + pagesArr[i].name + "</label>" + "<span class='control-label'>  发布成功!</span></div>";
                    } else {
                      resultText += "<div class='has-error'><label>" + pagesArr[i].name + "</label>" + " <span class='control-label'>  发布失败!</span></div>";
                    }
                  }
                  sweetAlert({
                    title: "发布结果",
                    type: "info",
                    html: resultText
                  }).then(function() {
                    $scope.setting.isMulti = false;
                    reloadPages();
                  });
                }, 1000);
              });
            });
          }
        }).then(function() {}, function() {})
      }

      // 全选、全不选
      $scope.toggleAll = function() {
        var toggleStatus = !$scope.isAllSelected;
        angular.forEach($scope.enablePages.pages, function(itm) { itm.selected = toggleStatus; });
        $scope.isAllSelected = toggleStatus;
      }

      $scope.itemToggled = function() {
        $scope.isAllSelected = $scope.enablePages.pages.every(function(itm) {
          return itm.selected;
        })
      }

      $scope.copy = function(page) {
        Dialog.openConfirm({ type: "info", confirmButtonColor: "#8CD4F5", text: "You will copy page:" + page.name + "!", confirmButtonText: "Yes, copy it" }).then(function(result) {
          MPagesService.copyPage(page, function() {
            reloadPages();
          }, function() {
            reloadPages();
          });
        }, function(error) {
          reloadPages();
        })
      }

      function loadPages() {
        var currentView = $scope.setting.currentView;
        var limit = $scope[currentView].pagination.limit,
            page = $scope[currentView].pagination.currentPage,
            filter = $scope[currentView].pagination.filter;

        MPagesService.getPages(limit, page, filter).then(function(result) {
          updateOnlineUrl(result.data);
          $scope[currentView].pages = result.data;
          $scope[currentView].pagination.total = result.count;
        })
      }

      function reloadPages() {
        var currentView = $scope.setting.currentView;
        $scope[currentView].pagination.currentPage = 1;
        loadPages();
      }

      function updateOnlineUrl(pages) {
        if (pages && pages.length > 0) {
          angular.forEach(pages, function(page) {
            if (page.publish_url) {
              page['online_url'] = APP_CONFIG.staticUrl + "/m/marketing/" + page.publish_url;
            }
          })
        }
      }

      //停用
      $scope.disable = function (page){
        Dialog.openConfirm({ type: "info", confirmButtonColor: "#8CD4F5", text: "You will disable page:" + page.name + "!", confirmButtonText: "Yes, disable it" }).then(function(result) {
          page.status = 2;
          MPagesService.disablePage(page, function() {
            reloadPages();
          }, function() {
            reloadPages();
          });
        });
      }

      //启用
      $scope.enable = function (page){
        page.status = 1;
        MPagesService.enablePage(page, function() {
          reloadPages();
        }, function() {
          reloadPages();
        });
      }

      $scope.pagination = function(){
        loadPages();
      }

      function init() {
        loadPages();
      }

      $scope.changeView = function(currentView){
        $scope.setting.currentView = currentView;
        loadPages();
      }

      init();
    }
  ])

  .controller('MPageCtrl', ['$scope', '$state', 'MPagesService', 'page', '$uibModal', '$sce', 'Dialog', '$q', 'EXEAuth',
    function($scope, $state, MPagesService, page, $uibModal, $sce, Dialog, $q, EXEAuth) {
      $scope.page = page;
      var page_db = angular.copy(page);


      if (!$scope.page) {
        sweetAlert("失败", "获取参数失败，请刷新重试!", "error");
        return;
      }
      if (!EXEAuth || !EXEAuth.currentUserData) {
        sweetAlert("失败", "获取登录用户信息失败，请重新登录!", "error");
        return;
      }

      $scope.args = {};
      $scope.formOptions = {};
      $scope.PercentageReference = MPagesService.PercentageReference;
      $scope.BlockTranslate = MPagesService.BlockTranslate;
      $scope.BlockSelectList = angular.copy(MPagesService.BlockSelectList);
      $scope.formFields = MPagesService.getFormFields();
      $scope.wxFields = MPagesService.getFormWXShareFields();

      function setInitializeData(page_id) {
        $scope.page.id = page_id = page_id || page.id;
        if (page_id) {
          $scope.previewUrl = $sce.trustAsResourceUrl($scope.APP_CONFIG.webSystemApi + "/m/marketing/template/" + page_id);
        }

        $scope.page.primary_actions = $scope.page.primary_actions || [];
        $scope.page.block_array = $scope.page.block_array || [];
        $scope.args.bakBlocks = angular.copy($scope.page.block_array);
        getPageRecord();
        initBlockBackground();
        updateBlockSelectListByBlockArray();
      }


      $scope.openBlock = function(block, parents) {
        angular.forEach(parents, function(item) {
          if (item.open !== block.open) {
            item.open = false;
          }
        })
        block.open = !!!block.open;
      }

      $scope.addBlock = function() {
        var result = $uibModal.open({
          templateUrl: 'modules/marketing/m_pages/views/templates/blockSelectDialog.tpl.html',
          controller: 'blockSelectDialogCtrl',
          resolve: {
            BlockTranslate: function() {
              return $scope.BlockTranslate;
            },
            BlockSelectList: function() {
              return $scope.BlockSelectList;
            }
          }
        }).result.then(function(type) {
          var _block = {
            'type': type,
            'bg_color': randomColor(),
            'opts': {
              name: $scope.BlockTranslate[type]
            }
          }

          $scope.page.block_array.push(_block);
          $scope.openBlock(_block, $scope.page.block_array);
          updateBlockSelectListByBlockArray();
        });
      }

      $scope.removeBlockFormBlocks = function(index,blockArray) {
        Dialog.openConfirm({text:"You will remove block_"+(index+1)+"!",confirmButtonText:"Yes, remove it"}).then(function(){
          blockArray.splice(index,1);
          updateBlockSelectListByBlockArray();
        });
      }

      $scope.resetBlocks = function(){
        Dialog.openConfirm({text:"You will reset all blocks!",confirmButtonText:"Yes, reset it"}).then(function(){
          $scope.page.block_array = angular.copy($scope.args.bakBlocks);
          updateBlockSelectListByBlockArray();
        });
      }

      $scope.moveArrayEle = function(targetIndex, distIndex, array) {
        if (targetIndex < 0 || distIndex < 0 || targetIndex >= array.length || distIndex >= array.length) {
          console.log("index不符合数组长度");
          return;
        }
        var tmp = array[targetIndex];
        array[targetIndex] = array[distIndex];
        array[distIndex] = tmp;
      }

      $scope.preview = function() {
        checkoutPageUrlLegal().then(function() {
          formatSubmitData();
          MPagesService.upsertPage($scope.page).then(function(result) {
            $('#previewIframe').attr('src', $('#previewIframe').attr('src'));
            setInitializeData(result.id);
          });
        })
      }

      $scope.submit = function() {
        checkoutPageUrlLegal().then(function() {
          formatSubmitData();
          MPagesService.upsertPage($scope.page).then(function() {
            $state.go('^.list');
          });
        })
      }

      function checkoutPageUrlLegal() {
        var deferred = $q.defer();

        if ($scope.page && $scope.page.url) {
          var url = $scope.page.url;
          if (MPagesService.jfwebLinks.indexOf(url) != -1) {
            sweetAlert("错误", "当前配置的页面路径已经存在exe-web项目中，请重新输入！", "error");
          } else {
            MPagesService.getPagesByUrl(url).then(function(pages) {
              if (pages.length > 0) {
                for (var i = 0; i < pages.length; i++) {
                  if (pages[i].id == $scope.page.id) {
                    deferred.resolve();
                    return;
                  }
                }
                sweetAlert("错误", "当前配置的页面路径已经存在exe-cms项目中，请重新输入！", "error");
              } else {
                deferred.resolve();
              }
            }, function(error) {
              console.log(error);
            })
          }
        }
        return deferred.promise;
      }

      function formatSubmitData() {
        //格式化actions数据
        if ($scope.page.primary_actions.length > 0) {
          angular.forEach($scope.page.primary_actions, function(action) {
            if (action.type == 'appointment_dialog') {
              delete action['redirect_url'];
            } else if (action.type == 'redirect') {
              delete action['opts'];
            }
          })
        }
        //格式化blocks数据
        if ($scope.page.block_array.length > 0) {
          angular.forEach($scope.page.block_array, function(block) {
            delete block['open'];
            delete block['bg_color'];
          })
        }
      }

      $scope.editAppointmentDialogOpts = function(action) {
        var result = $uibModal.open({
          templateUrl: 'modules/marketing/m_pages/views/templates/appointmentDialogOpts.tpl.html',
          controller: 'AppointmentDialogOptsCtrl',
          size: 'lg',
          resolve: {
            opts: function() {
              return angular.copy(action.opts);
            }
          }
        }).result.then(function(result) {
          action.opts = result;
        });
      }


      $scope.calcActionTotalPercentage = function() {
        var tmp = 0;
        if ($scope.page.primary_actions.length > 0) {
          angular.forEach($scope.page.primary_actions, function(action) {
            tmp = tmp + parseFloat(action.percentage);
          })
        }
        $scope.args.actionTotalPercentage = tmp * 100 + "%";
      }

      $scope.watchAppointmentAction = function() {
        if ($scope.page.primary_actions.length > 0) {
          $scope.args.disableAppointmentAction = false;
          angular.forEach($scope.page.primary_actions, function(action) {
            if (action.type == 'appointment_dialog') {
              $scope.args.disableAppointmentAction = true;
            }
          })
        }
      }

      function getPageRecord() {
        if ($scope.page && $scope.page.id) {
          MPagesService.getPageRecordByPageId($scope.page.id, function(result) {
            $scope.pageRecord = result;
          }, function(error) {
            console.log(error);
          })
        }
      }

      function initBlockBackground() {
        if ($scope.page.block_array.length > 0) {
          angular.forEach($scope.page.block_array, function(block) {
            block['bg_color'] = randomColor();
          })
        }
      }

      function randomColor() {
        return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
      }

      function updateBlockSelectListByBlockArray() {
        angular.forEach($scope.BlockSelectList, function(block) {
          block['disabled'] = false;
        })
        angular.forEach($scope.page.block_array, function(block) {
          for (var i = 0; i < $scope.BlockSelectList.length; i++) {
            if ($scope.BlockSelectList[i].type == block.type && $scope.BlockSelectList[i].onlyone) {
              $scope.BlockSelectList[i].disabled = true;
              break;
            }
          }
        })
      }

      $scope.openBlockBgEditer = function(index, block) {
        var bgEditerResult = $uibModal.open({
          templateUrl: 'modules/marketing/m_pages/views/templates/blockBgEditerDialog.tpl.html',
          controller: 'blockBgEditerDialogCtrl',
          resolve: {
            blockBg: function() {
              return block.opts.block_bg;
            }
          }
        }).result.then(function(_block_bg){
          if(_block_bg){
            block.opts.block_bg = angular.copy(_block_bg);
          }
        });
      }

      $scope.delete = function(page){
        Dialog.openConfirm({text:"You will delete page:"+page.name+"!",confirmButtonText:"Yes, delete it"}).then(function(result) {
          MPagesService.deletePage(page, function() {
            $state.go('^.list');
          }, function() {
            console.log("删除失败");
          });
        });
      }

      $scope.watchAppointmentAction();
      $scope.calcActionTotalPercentage();

      setInitializeData($scope.page.id);
    }
  ])

  .controller('AppointmentDialogOptsCtrl', ['$scope', 'MPagesService', '$uibModalInstance', 'opts',
    function($scope, MPagesService, $uibModalInstance, opts) {
      $scope.SMSTYPE = MPagesService.SMSTYPE;
      $scope.opts = opts || { first: {} };
      $scope.args = { needSecond: !!$scope.opts.second };
      $scope.ok = function() {
        if (!$scope.args.needSecond) {
          delete $scope.opts['second'];
        }
        $uibModalInstance.close($scope.opts);
      };

      $scope.getDefaultOpts = function() {
        $scope.opts = {
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
        $scope.args.needSecond = true;
      }

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ])

  .controller('blockSelectDialogCtrl', ['$scope', '$uibModalInstance', 'BlockTranslate', 'BlockSelectList',
    function($scope, $uibModalInstance, BlockTranslate, BlockSelectList) {
      $scope.BlockTranslate = BlockTranslate;
      $scope.BlockSelectList = BlockSelectList;
      $scope.args = { current: 'common_template' };

      $scope.ok = function() {
        $uibModalInstance.close($scope.args.current);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.selectBlock = function(block) {
        if (block.disabled) {
          return;
        }
        $scope.args.current = block.type;
      }
    }
  ])

  .controller('blockBgEditerDialogCtrl',['$scope', '$uibModalInstance', 'blockBg', 
    function($scope, $uibModalInstance, blockBg){
      //回填
      $scope.args = {
        blockBg: angular.copy(blockBg) || {bg:{color:"",img:""},padding: ["0","0","0","0"]},
      }

      $scope.setting = {
        uploadImg: false
      }

      $scope.ok = function () {
        //把用户置空的都替换为0
        for(var i = 0, length = $scope.args.blockBg.padding.length; i<length; i++){
          if(!$scope.args.blockBg.padding[i]){
            $scope.args.blockBg.padding[i] = "0";
          }
        }
        $uibModalInstance.close($scope.args.blockBg);
      }

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      }

      $scope.addBgColor = function() {
        if($scope.args.blockBg.bg.color) return;
        $scope.args.blockBg.bg.color = "transparent";
      }

      $scope.addBgImg = function() {
        if($scope.args.blockBg.bg.img) return;
        $scope.args.blockBg.bg.img = "";
        $scope.setting.uploadImg = true;
      }

      $scope.removeBgImgItem = function() {
        $scope.args.blockBg.bg.img = "";
        $scope.setting.uploadImg = false;
      }

      $scope.removeBgColor = function() {
        $scope.args.blockBg.bg.color = "";
      }
    }
  ])
})();
