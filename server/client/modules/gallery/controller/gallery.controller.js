(function() {
  'use strict';
  angular.module('exe.experience.gallery')
  .controller('glassesCtrl', ['$scope', '$state', 'GalleryService', 'glassesList', '$stateParams', 'seriesInfo',
    function($scope, $state, GalleryService, glassesList, $stateParams, seriesInfo){
    	$scope.pageClass = 'page-glasses';
    	
    	$scope.back = function(){
				$scope.$eval($scope.args.backCall);
    	}

    	$scope.selectGlasses = function(selectedGlasses){
    		$scope.$eval($scope.args.selectGlasses(selectedGlasses));
    	}

    	$scope.linkToCompare = function(){
    		$state.go('experience.gallery.glasses.compare');
    	}

    	$scope.doFullScreen = function(){
    		var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !==     null) ||    // alternative standard method  
          (document.mozFullScreen || document.webkitIsFullScreen);

		    var docElm = document.documentElement;
		    if (!isInFullScreen) {
	        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
	        }
	        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
	        }
	        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
	        }
		    }
    	}

    	function init(){
    		launchFullScreen(document);

	    	$scope.seriesInfo = seriesInfo;

	    	$scope.glassesList = glassesList;

    		$scope.args = {
    			loading: false,
    			pageTitle: "• " + seriesInfo.name + "系列 •" 
    		}

	    	$scope.args.curGlasses =  $stateParams.selecedCompare;

	    	$scope.compareGlasses = {
	    		left:[],
	    		right:[]
	    	}

    		//窗口缩放，侧边栏保持显示6副眼镜
	    	setTimeout(function(){
		    	$(window).resize(function() {
					  var sideHeight = $(window).height()-76;
					  var $glassesWrapper = $(".gallery-glasses");
					  $glassesWrapper.find(".sidebar,.detail").height(sideHeight);
					  // $glassesWrapper.find(".glasses-list li").height(sideHeight/6);
					});
					$(window).resize();
	    	},0)

	    	//设置镜架展示页面返回事件
	    	$scope.args.backCall = function(){
	    		$stateParams.id = 1;
	    		$state.go('experience.gallery.series', $stateParams, {
	    			reload: false,
	    			inherit: false,
	    			notify: true
					});
	    	};

	    	//设置眼镜选中事件
	    	$scope.args.selectGlasses = function(selectedGlasses){
    			$scope.args.curGlasses = angular.copy(selectedGlasses);
	    	}
    	}

    	function launchFullScreen(element) {
			  if (element.requestFullscreen) {
			    element.requestFullscreen();
			  } else if (element.mozRequestFullScreen) {
			    element.mozRequestFullScreen();
			  } else if (element.webkitRequestFullscreen) {
			    element.webkitRequestFullscreen();
			  } else if (element.msRequestFullscreen) {
			    element.msRequestFullscreen();
			  }
			}

    	init();
    }
  ])
  .controller('glassesCompareCtrl', ['$scope', '$state', 'GalleryService', 'glassesList', '$stateParams', '$timeout', 'seriesInfo',
    function($scope, $state, GalleryService, glassesList, $stateParams, $timeout, seriesInfo){
			$scope.pageClass = 'page-compare';
			
			$scope.linkToSeries = function(selecedCompare){
				$stateParams.selecedCompare = selecedCompare[0];
				$state.go('experience.gallery.glasses', $stateParams, {
    			reload: true,
    			inherit: false,
    			notify: true
				});
			}

			function init(){
				$(window).resize();

				$scope.args.pageTitle = "• " + seriesInfo.name + "系列选镜台 •";

	    	if($scope.args.curGlasses){
	    		$scope.compareGlasses.right.push(angular.copy($scope.args.curGlasses));
	    		//让有图片的比区域可滚动
	    		setTimeout(function(){
	    			$(".compare-area").eq(1).addClass("scroll-y");
	    		},500);
	    	}

	    	//设置当前页面左上角返回事件
	    	$scope.args.backCall = function(){
	    		//跳转至眼镜列表页面
	    		$stateParams.selecedCompare = null;
	    		$state.go('experience.gallery.glasses', $stateParams, {
	    			reload: true,
	    			inherit: false,
	    			notify: true
					});
	    	}

	    	//设置眼镜选中事件
        //点击眼镜，默认加入左边对比区域
	    	$scope.args.selectGlasses = function(selectGlasses){
          if($scope.compareGlasses.left.length > 0 && selectGlasses.id == $scope.compareGlasses.left[0].id){
            return false;
          }
          if($scope.compareGlasses.right.length > 0 && selectGlasses.id == $scope.compareGlasses.right[0].id){
            return false;
          }
	    		$scope.compareGlasses.left.splice(0,1);
          $scope.compareGlasses.left.push(selectGlasses);
          scrollCompare();
	    	}

    		//记录降落的活动，降落的区域
    		$scope.args.drop = {};

	    	//开启降落事件
	    	$timeout(function(){
	    		$(".compare-area").droppable({
	    			drop: function(event, ui){
	    				$scope.args.drop.active = true;
	    				$scope.args.drop.area = $(this).data("index") == "0" ? "left" : "right";
	    			}
	    		});
	    	},1000);

	    	//设置侧边栏可拖动
	    	$timeout(function(){
	    		$(".glasses-item .dragged-item").draggable({
	    			start: function(event, ui){
	    				$(this).addClass("dragged");
							$(this).addClass("show");
	    			},
	    			stop: function(event, ui){
							//降落到指定对比区域
							if($scope.args.drop.active){
	    					//拿到当前拖拽元素的信息
	    					var draggedGlasses = $(this).data("glassesid");
	    					$scope.compareGlasses[$scope.args.drop.area].splice(0,1);
	    					$scope.compareGlasses[$scope.args.drop.area].push(draggedGlasses);
                //设置对比区域的滚动
								scrollCompare();

	    					if($scope.args.drop.area == 'right' && $scope.args.curGlasses) $scope.args.curGlasses = {};
	    				}
	    				//让眼镜复位
							$(this).removeClass("show");
	    				$scope.args.drop.active = false;
	    				$scope.args.drop.area = "";
	    				$(this).removeClass("dragged");
	    				$(this).css({'top':0,'left':0,'right':0,'bottom':0});
	    				$scope.$apply();
	    			}
	    		});
		    },100);
			}

      function scrollCompare(){
        //只有一个对比图时，一面可滚动，另一面不可滚动
        if($scope.compareGlasses.left.length>0 && $scope.compareGlasses.right.length<1){
          $(".compare-area").eq(0).addClass("scroll-y");
        }else if($scope.compareGlasses.right.length>0 && $scope.compareGlasses.left.length<1){
          $(".compare-area").eq(1).addClass("scroll-y");
        }else{
          //扩大眼镜图的降落范围，选择最长的一侧高度
          var maxDropAreaHeight = 0;
          setTimeout(function(){
            $(".compare-area").each(function(){
              var dropAreaHeight = $(this).find(".compare-item").height();
              maxDropAreaHeight = maxDropAreaHeight <  dropAreaHeight ? dropAreaHeight : maxDropAreaHeight;
            });
            $(".compare-area").height(maxDropAreaHeight)
          },500);
          //当有两个对比图时，可同时滚动
          $(".glasses-compare-wrap").addClass("scroll-y");
          $(".compare-area.scroll-y").removeClass("scroll-y");
        }
      }

			init();    	
  	}
  ])
  .controller('seriesCtrl', ['$scope', '$stateParams', '$state', '$window', 'GalleryService',
    function($scope,$stateParams,$state,$window,GalleryService) {
    $scope.pageClass = 'page-series';

      $(".gallery-series").height($window.innerHeight)
      $window.onresize = function(){
        $(".gallery-series").height($window.innerHeight)
      }

      function init(){
        $scope.args = {
          currThemeId : $stateParams.id,
          currActive : 0
        }

        GalleryService.getSeriesByThemeId($stateParams.id).then(function(result){
          $scope.series = result;
        })

        GalleryService.getTheme().then(function(result){
          if(result.data && result.data.length > 0){
          	var currentTheme = {};
          	for(let i=0;i<result.data.length;i++){
          		if(result.data[i].id == $scope.args.currThemeId){
          			currentTheme = result.data[i];
          			result.data.splice(i,1);
          			break;
          		}
          	}
          	result.data.unshift(currentTheme);
            initStageWheel(result.data);
          }
        })

        $(".gallery-series").click(function(event){
        	$(".item-serie").removeClass("enlarge");
        })
      }

      $scope.switchTheme = function(theme_id){
        if(theme_id == $scope.args.currThemeId) return;
        $scope.args.currThemeId = theme_id;
        $("#seriesList").removeClass('show');
        $("#loading").fadeIn('500');
        GalleryService.getSeriesByThemeId(theme_id).then(function(result){
          $scope.series = result;
          setTimeout(function(){
          	$("#loading").hide();
            if(theme_id == $scope.args.currThemeId){
              $("#seriesList").addClass('show');
            }
          },500)
        },function(error){
          alert("加载失败，请刷新重试！");
        })
      }

      $scope.linkToSeries = function(series_id, event){
      	setTimeout(function(){
	      	$stateParams.id = series_id;
	      	$state.go('experience.gallery.glasses', $stateParams);
      	},0);
      }

      function initStageWheel(themes){
        //每个主题相隔角度
        var eachAngle = 15;
        //主题数量
        var itemLength = Math.floor(360 / eachAngle);
        //补全转轮需要的主题列表
        if(themes.length > itemLength){
          //如果超过最大主题数量，删除排后的主题
          themes.splice(itemLength,themes.length - itemLength);
        }else if(themes.length < itemLength){
          //如果少于最大主题数，补全
          //获取需要补全的倍数
          var times = Math.ceil(itemLength / themes.length);
          //定义最小单元
          var _themes = angular.copy(themes);
          //按照最小单元进行补全
          for(var i = 1;i<times;i++){
            themes = themes.concat(angular.copy(_themes));
          }
          //去除多余的填充元素
          themes.splice(itemLength,themes.length - itemLength);
        }

        var itemWidth = 250;
        var itemHeigth = 50;
        var R = 1080 / 2;
        var r = R - (1080 - 630) / 4;
        var radian = 2 * Math.PI / 360;
        for(var j = 0;j<themes.length;j++){
          var x = R - Math.cos(j * eachAngle * radian) * r - itemWidth / 2;
          var y = R - Math.sin(j * eachAngle * radian) * r - itemHeigth / 2;
          themes[j].x = x;
          themes[j].y = y;
          themes[j].r = j * eachAngle;
        }

        createRotation(eachAngle);

        $scope.themes = themes;
      }

      function createRotation(rotationSnap){
        rotationSnap = rotationSnap || 15;
        Draggable.create("#stageWheel", {
          type:"rotation",
          throwProps:true,
          snap:function(endValue) {
            var angle = Math.round(endValue / rotationSnap) * rotationSnap;
            var index = angle > 0 ? (angle * (-1) + 720) % 360 /15 : (angle * (-1)) % 360 /15;
            $scope.args.currActive = index;
            $scope.$apply();
            $scope.switchTheme($(".theme-list .theme-item.theme-item-"+index).data("themeid"));
            return Math.round(endValue / rotationSnap) * rotationSnap;
          },
          onDragEnd: function(e){
            console.log('end');
          }
        });
      }

      init();
    }
  ])
  .directive('repeatFinish',function(){
    return {
      link: function(scope,element,attr){
        if(scope.$last){
        	setTimeout(function(){
        		$("img.lazy").lazyload({
        			threshold : "1000",
        			effect: "fadeIn", 
      			 	container: $("#glassesDetail")
        		});
        	},0);
        }
      }
    }
	})
  .directive('repeatSeriesFinish',function(){
    return {
      link: function(scope,element,attr){
        if(scope.$last){
          setTimeout(function(){
            $("#seriesList").height($("#seriesList .item-serie").outerHeight(true) * Math.ceil(scope.series.length /3));
          },200);
        }
      }
    }
  })
})();