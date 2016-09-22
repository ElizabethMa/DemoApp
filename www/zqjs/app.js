// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

	.run(['$rootScope', '$state','$urlRouter','$location','$ionicModal','$ionicLoading', '$ionicHistory','$ionicPlatform','LoginService','CustomListService',
		function ($rootScope, $state,$urlRouter,$location,$ionicModal,$ionicLoading, $ionicHistory,$ionicPlatform , LoginService, CustomListService) {

			$rootScope.$state = $state;

			$rootScope.login_states = {
				type: 'none',
				broker_id: '',
			};

			$rootScope.login_params = {
				type: 'sim',
			};

//			if(LoginService.get_login_state() == "none"){
//				$rootScope.login_states.type = 'none';
//			}else if(LoginService.get_login_state() == "sim"){
//				$rootScope.login_states.type = 'sim';
//			}else{
//				$rootScope.login_states.type = 'act';
//				$rootScope.login_states.broker_id = LoginService.get_login_state();
//			}

			WS.init(SETTING.sim_server_url);

			$rootScope.$settings = {
				quote_listtype: 'main' ,
				posdetail_cell_height : 60, // 同时修改 style.css .posdetail .pos-box
			}

			$ionicModal.fromTemplateUrl('templates/modals/login.html',{
				scope: $rootScope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$rootScope.loginModal = modal;
			});
			$ionicModal.fromTemplateUrl('templates/modals/register.html',{
				scope: $rootScope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$rootScope.registerModal = modal;
			});
			$ionicModal.fromTemplateUrl('templates/modals/changepwd.html',{
				scope: $rootScope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$rootScope.changepwdModal = modal;
			});

			$rootScope.closeModal = function(){
				if($rootScope.loginModal.isShown()){
					$rootScope.loginModal.hide();
				}
				if($rootScope.registerModal.isShown()){
					$rootScope.registerModal.hide();
				}
				if($rootScope.changepwdModal.isShown()){
					$rootScope.changepwdModal.hide();
				}
			};

			$rootScope.switchParams = function(){
				if($rootScope.login_params.type == 'sim'){
					$rootScope.login_params.type = 'act';
				}else{
					$rootScope.login_params.type = 'sim';
				}
			}

			$rootScope.do_login = function(){
				$ionicLoading.show({
					template: '登录中...'
				}).then(function(){
					console.log("The loading indicator is now displayed");
				});


				LoginService.do_login().then(function (response) {
					if(response.status == 200){
						var d = response.data;
						localStorage.setItem('Shinny-Session', d["Shinny-Session"]);
						localStorage.setItem('account_id', d["account_id"]);
						localStorage.setItem('broker_id', d["broker_id"]);
						localStorage.setItem('expire_time', d["expire_time"]);
						localStorage.setItem('user_id', d["user_id"]);
						if(d["broker_id"] == 'sim'){
							WS.init(SETTING.sim_server_url);
						}else{
							WS.init(SETTING.act_server_url);
						}
					}
					console.log(response);
				});

				$rootScope.login_states.type = $rootScope.login_params.type;

				$ionicLoading.hide().then(function(){
					console.log("The loading indicator is now hidden");
					$rootScope.closeModal();
				});
			}


			$rootScope.register = function(){
				LoginService.do_register();

			}


			$ionicPlatform.ready(function () {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
//				if (window.cordova && window.cordova.plugins.Keyboard) {
//					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//					cordova.plugins.Keyboard.disableScroll(true);
//
//				}
//				if (window.StatusBar) {
//					// org.apache.cordova.statusbar required
//					StatusBar.styleDefault();
//				}
			});

			CustomListService.init();
		}
	])

	.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
		function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

			$urlRouterProvider.otherwise('/app/tabs/quote');

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
					url: '/quote',
					views: {
						'tab-quote': {
							templateUrl: 'templates/quote.html',
							controller: 'QuoteCtrl'
						}
					}
				})

				// 报价
				.state('app.tabs.custom', {
					url: '/custom',
					views: {
						'tab-custom': {
							templateUrl: 'templates/custom.html',
							controller: 'CustomCtrl'
						}
					}
				})

				// 持仓
				.state('app.tabs.position', {
					url: '/position',
					views: {
						'tab-position': {
							templateUrl: 'templates/position.html',
							controller: 'PositionCtrl'
						}
					}
				})

				// 成交
				.state('app.tabs.transaction', {
					url: '/transaction',
					views: {
						'tab-transaction': {
							templateUrl: 'templates/transaction.html',
							controller: 'TransactionCtrl'
						}
					}
				})

				// 交易详情
				.state('app.posdetail', {
					url: '/posdetail/:insid/:posid',
					templateUrl: 'templates/posdetail.html',
					controller: 'PosdetailCtrl'
				})

				// 银期转账
				.state('app.banktransfer', {
					url: '/banktransfer',
					templateUrl: 'templates/banktransfer.html',
					controller: 'AppCtrl'
				})

				// 个人信息
				.state('app.userinfo', {
					url: '/userinfo',
					templateUrl: 'templates/userinfo.html',
					controller: 'UserinfoCtrl'
				});

			$ionicConfigProvider.platform.ios.tabs.style('standard');
			$ionicConfigProvider.platform.ios.tabs.position('bottom');
			$ionicConfigProvider.platform.android.tabs.style('standard');
			$ionicConfigProvider.platform.android.tabs.position('bottom');

			$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
			$ionicConfigProvider.platform.android.navBar.alignTitle('center');

			$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
			$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

			$ionicConfigProvider.platform.ios.views.transition('ios');
			$ionicConfigProvider.platform.android.views.transition('android');

		}
	])
	.directive('tableAddon', [function() {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var table_qt_rc = document.createElement('table');
				table_qt_rc.className = "quote qt_rc";
				table_qt_rc.innerHTML = '<thead> <tr class="odd"> <td>合约代码</td> </tr> <tr class="even"> <td>合约名称</td> </tr> </thead>';

				var div_qt_rwrapper = document.createElement('div');
				div_qt_rwrapper.className = "qt_rwrapper";
				var temp = '<table class="quote qt_r"> <thead> <tr class="odd"> <td>合约代码</td>';
				for(var i=0; i<CONSTANT.inslist_cols_odd_name.length; i++){
					temp += '<td>'+CONSTANT.inslist_cols_odd_name[i]+'</td>';
				}
				temp += '</tr> <tr class="even"> <td>合约名称</td>';
				for(var i=0; i<CONSTANT.inslist_cols_even_name.length; i++){
					temp += '<td>'+CONSTANT.inslist_cols_even_name[i]+'</td>';
				}
				temp += '</tr> </thead> <tbody> </tbody></table>';

				div_qt_rwrapper.innerHTML = temp;

				var div_qt_cwrapper = document.createElement('div');
				div_qt_cwrapper.className = "qt_cwrapper";
				div_qt_cwrapper.innerHTML = '<table class="quote qt_c"> <thead> <tr class="odd"> <td>合约代码</td> </tr> <tr class="even"> <td>合约名称</td></tr> </thead> <tbody> </tbody></table>';
				ele[0].appendChild(table_qt_rc);
				ele[0].appendChild(div_qt_rwrapper);
				ele[0].appendChild(div_qt_cwrapper);
			}
		}
	}])
	.directive('tableAddonOdd', [function() {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var temp = ' <td>合约代码</td>';
				for(var i=0; i<CONSTANT.inslist_cols_odd_name.length; i++){
					temp += '<td>'+CONSTANT.inslist_cols_odd_name[i]+'</td>';
				}
				ele[0].innerHTML = temp;
			}
		}
	}])
	.directive('tableAddonEven', [function() {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				var temp = ' <td>合约名称</td>';
				for(var i=0; i<CONSTANT.inslist_cols_even_name.length; i++){
					temp += '<td>'+CONSTANT.inslist_cols_even_name[i]+'</td>';
				}
				ele[0].innerHTML = temp;
			}
		}
	}])

	.directive('calHeight', ['$rootScope',function($rootScope) {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs){
				var cell_height = $rootScope.$settings.posdetail_cell_height;

				var contentHeight = ele[0].parentElement.clientHeight;
				var barHeight = ele[0].parentElement.querySelector('.bar').clientHeight;
				var listHeight = ele[0].parentElement.querySelector('.list').clientHeight;
				var restHeight = contentHeight - barHeight - listHeight;

				var rowNum = Math.floor(restHeight/cell_height);

				var height = rowNum * cell_height;

				if(height < 1){ height = cell_height; }

				ele[0].style.height =  height+'px';

				ele[0].querySelector('.pos-boxes').style.height = height+'px';
			}
		};
	}]);

var Ctrls = angular.module('starter.controllers', []);
