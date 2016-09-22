
Ctrls.controller('QuoteCtrl', ['$rootScope', '$scope', '$ionicScrollDelegate',
	function ($rootScope, $scope, $ionicScrollDelegate) {

//		$scope.$on("$ionicView.afterEnter", function (event, data) {
//		});


		$scope.followScroll = function () {
			var top = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().top;
			var left = $ionicScrollDelegate.$getByHandle('handler').getScrollPosition().left;
			var qt_c = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_c');
			var qt_r = document.querySelector('.inslist_type_' + $scope.listtype + ' table.qt_r');
			qt_r.style.left = (left * -1) + 'px';
			qt_c.style.top = (top * -1) + 'px';
		}

		$scope.$watch("$settings.quote_listtype", function (newData, oldData) {

			console.log($rootScope.$settings.quote_listtype);

			$scope.listtype = $rootScope.$settings.quote_listtype;
			$scope.title = CONST.ins_type[$scope.listtype];

			DM.update_data({
				"state": {
					"page_id_local": "page_quote",
					"ins_type": $scope.listtype,
				}
			});

			WS.send({
				aid: "switch_page",
				state: {
					page_id: "page1",
					ins_type: $scope.listtype,
					ins_list: {
						cu1612: "",
						T1612: "",
						c1701: "",
//						IF1610:"",
//						IF1612:"",
//						TF1612:""
					}
				}
			});
		});

	}]);