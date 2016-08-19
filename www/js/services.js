angular.module('starter.services', ['ngWebsocket'])
	.run(['$rootScope', '$websocket', function ($rootScope, $websocket) {
		$rootScope.$serverUrl = {
			'quotations': 'ws://192.168.1.70:7667',
			'transactions': 'ws://192.168.1.70:7667',
			'queries': 'http://api.zhognqijiaoyi.com'
		};

		var ws_quotations = $websocket.$new({
				url: $rootScope.$serverUrl.quotations
			})
			.$on('$open', function () {
				console.log('行情 ws_quotations is open');
			})
			.$on('$message', function (data) {
				console.log(data);
			})
			.$on('$close', function () {
				console.log('行情 ws_quotations is close');
			});

		var ws_transactions = $websocket.$new({
				url: $rootScope.$serverUrl.transactions
			})
			.$on('$open', function () {
				console.log('交易 ws_transactions is open');
			})
			.$on('$close', function () {
				console.log('交易 ws_quotations is close');
			});
	}])


	.service('SettingsService', function () {
		var _variables = {};
		return {
			init: function () {
				for (var i = 0; i < localStorage.length; i++) {
					_variables[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
				}
				return _variables;
			},
			get: function (varname) {
				return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
			},
			set: function (varname, value, isPermanent) {
				if (isPermanent) {
					localStorage.setItem(varname, JSON.stringify(value));
				}
				_variables[varname] = value;
				return value;
			},
			remove: function (varname) {
				localStorage.removeItem(varname);
				delete _variables[varname];
				return varname;
			}
		};
	})

	.service('QueryService', [function () {
		var _baseUrl = $rootScope.$serverUrl.queries;

		var loginService = {
			login: function (param) {
				console.log("response:" + $rootScope.settings.serverPath.baseUrl);
				//login
				var promise = $http.post(_baseUrl + '/sessions', param);
				return promise;
			},
			changePassword: function (param) {
				console.log(param);
				var promise = $http.put(_baseUrl + '/password', param);
				return promise;
			}
		}
		return loginService;
	}])

