// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

	.run(['$rootScope', '$state', '$ionicPlatform', 'SettingsService',
		function ($rootScope, $state, $ionicPlatform, SettingsService) {
			$rootScope.$state = $state;

			SettingsService.init();

			$ionicPlatform.ready(function () {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				if (window.cordova && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					cordova.plugins.Keyboard.disableScroll(true);

				}
				if (window.StatusBar) {
					// org.apache.cordova.statusbar required
					StatusBar.styleDefault();
				}
			});
		}
	])

	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {


			$urlRouterProvider.otherwise('/app/tabs/quote/main');

			$stateProvider
				.state('app', {
					url: '/app',
					abstract: true,
					templateUrl: 'templates/menu.html',
					controller: 'AppCtrl'
				})

				// tabs
				.state('app.tabs', {
					url: '/tabs',
					abstract: true,
					templateUrl: 'templates/tabs.html',
					controller: 'AppCtrl'
				})

				// 报价
				.state('app.tabs.quote', {
					url: '/quote/:page',
					views: {
						'tab-quote': {
							templateUrl: 'templates/quote.html',
							controller: 'QuoteCtrl'
						}
					}
				})

				// 持仓
				.state('app.tabs.position', {
					url: '/position',
					views: {
						'tab-position': {
							templateUrl: 'templates/position.html'
						}
					}
				})

				// 成交
				.state('app.tabs.history', {
					url: '/history',
					views: {
						'tab-history': {
							templateUrl: 'templates/history.html'
						}
					}
				})


				// 银期转账
				.state('app.transaction', {
					url: '/transaction',
					templateUrl: 'templates/transaction.html',
					controller: 'AppCtrl'
				})

				// 登录、注册
				.state('app.login', {
					url: '/login',
					templateUrl: 'templates/login.html',
					controller: 'AppCtrl'
				})

				.state('app.single', {
					url: '/playlists/:playlistId',
					views: {
						'tab-dash': {
							templateUrl: 'templates/playlist.html',
							controller: 'PlaylistCtrl'
						}
					}
				});
		}
	]);
