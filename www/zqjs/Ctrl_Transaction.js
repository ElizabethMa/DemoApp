Ctrls.controller('TransactionCtrl', ['$rootScope', '$scope',
	function ($rootScope, $scope) {
		$scope.$on("$ionicView.afterEnter", function (event, data) {
			DM.update_data({
				"state": {
					"page_id_local": "page_position"
				}
			});
		});

		$scope.$on("$ionicView.enter", function (event, data) {
			WS.send({
				type: "switchp",
				page: 'poslist'
			});

			DM.update_data({
				"state": {
					"page_id_local": "page_transaction"
				}
			});

		});

	}])