angular.module('starter.controllers', [])

	.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function () {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.login = function () {
			$scope.modal.show();
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function () {
			console.log('Doing login', $scope.loginData);

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function () {
				$scope.closeLogin();
			}, 1000);
		};
	})

	.controller('PlaylistsCtrl', function ($scope) {
		$scope.playlists = [
			{title: 'Reggae', id: 1},
			{title: 'Chill', id: 2},
			{title: 'Dubstep', id: 3},
			{title: 'Indie', id: 4},
			{title: 'Rap', id: 5},
			{title: 'Cowbell', id: 6},
			{title: 'Rap', id: 7},
			{title: 'Cowbell', id: 8},
			{title: 'Rap', id: 9},
			{title: 'Cowbell', id: 8}

		];
	})

	.controller('QuoteCtrl', ['$scope', '$stateParams', '$websocket', function ($scope, $stateParams, $websocket) {
		$scope.$on("$ionicView.beforeEnter", function(event, data){
			// handle event
			console.log("State Params: ", data.stateParams);
		});

		var page = $stateParams.page;

		if( page == 'all' ){
			$scope.title = '全部合约'
		}

		if( page == 'main' ){
			$scope.title = '主力合约'
		}

		var ws_quotations = $websocket.$get('ws://192.168.1.70:7667')
			.$$send({
				type: "switchp",
				page: page
			});

	}]);
