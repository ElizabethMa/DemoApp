Ctrls.controller('PositionCtrl', ['$rootScope', '$scope',
	function ($rootScope, $scope) {

		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({
				"state": {
					"page_id_local": "page_position"
				}
			});

		});

	}])