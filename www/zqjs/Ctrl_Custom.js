Ctrls.controller('CustomCtrl',
	['$rootScope', '$scope','CustomListService', '$ionicScrollDelegate',
	function ($rootScope, $scope,CustomListService, $ionicScrollDelegate) {

		$scope.title = '自选合约';
		$scope.listtype = 'custom';

		$scope.$on("$ionicView.enter", function (event, data) {

			DM.update_data({
				"state": {
					"page_id_local": "page_quote",
					"ins_type": $scope.listtype,
				}
			});

			delete $scope.followScroll;

			$scope.followScroll = function () {
				var top = $ionicScrollDelegate.$getByHandle('handler_custom').getScrollPosition().top;
				var left = $ionicScrollDelegate.$getByHandle('handler_custom').getScrollPosition().left;
				var qt_c = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_c');
				var qt_r = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_r');
				qt_r.style.left = (left * -1) + 'px';
				qt_c.style.top = (top * -1) + 'px';
			}

			var customList = CustomListService.getAll();

			var customObj = {};

			for(var i=0; i<customList.length; i++){
				customObj[customList[i]] = "";
			}

			WS.send({
				aid: "switch_page",
				state: {
					"page_id": "page1",
					"ins_type": $scope.listtype,
					"ins_list": customObj
				}
			});
		})


	}])