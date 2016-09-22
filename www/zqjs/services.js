angular.module('starter.services', [])
	.service('QueryService', [function () {
		var _baseUrl = SETTING.server_base_url;
		var queryService = {
			history: function (param) {
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
		return queryService;
	}])
	.service('LoginService', ['$rootScope', '$http', function ($rootScope, $http) {
		var _baseUrl = SETTING.server_base_url;

		var loginService = {
			get_login_state: function () {
				if(localStorage.getItem('broker_id') == null){
					return 'none';
				}else {
					return localStorage.getItem('broker_id');
				}
			},
			do_login: function (param) {
				// 测试账户
				param = {"account_id": "41007684", "password": "1"};
				//login
				var promise = $http.post(_baseUrl + '/account_sessions', param, {withCredentials: true});
				return promise;
			},
			do_register: function (param) {
				"use strict";

			},
			changePassword: function (param) {
				console.log(param);
				var promise = $http.put(_baseUrl + '/password', param);
				return promise;
			}
		}
		return loginService;
	}])

	.service('CustomListService', ['$q', function ($q) {
		var getAll = function(){
			var s = localStorage.getItem('CustomList');
			if (s.length > 0) {
				return s.split(',');
			} else {
				return [];
			}
		}
		var CustomList = {
			"init": function () {
				if (localStorage.getItem('CustomList') === null) {
					localStorage.setItem('CustomList', '');
				}
			},
			"add": function (insid) {
				var s = localStorage.getItem('CustomList');
				if (s.indexOf(insid) == -1) {
					if (s.length > 0) {s += (',' + insid);}
					else {s += insid;}
					localStorage.setItem('CustomList', s);
				}
				return s.split(',');
			},
			"delete": function (insid) {
				var list = getAll();
				var index = list.indexOf(insid);
				if(index > -1){
					list.splice(index, 1);
					localStorage.setItem('CustomList', list.join(','));
				}
				return list;
			},
			"isCustom": function (insid) {
				return localStorage.getItem('CustomList').indexOf(insid) > -1;
			},
			"getAll": getAll
		}
		return CustomList;
	}])