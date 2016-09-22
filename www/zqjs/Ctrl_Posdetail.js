Ctrls.controller('PosdetailCtrl', ['$rootScope', '$scope','$ionicPopup', '$ionicLoading', 'CustomListService',
	function ($rootScope, $scope,$ionicPopup, $ionicLoading, CustomListService) {

		$scope.title = $rootScope.$state.params.insid;

		$scope.changeCustom = function () {
			if (!$scope.iscustom) {
				CustomListService.add($rootScope.$state.params.insid);
				$scope.iscustom = !$scope.iscustom;
			} else {
				CustomListService.delete($rootScope.$state.params.insid);
				$scope.iscustom = !$scope.iscustom;
			}

		}

		$scope.select_other_pos = function () {

			$scope.other_pos = {
				'ere':{
					"direction": "BUY",
					"float_profit": -1650,
					"memo": "",
					"volume": 1,
				},
				'er4e':{
					"direction": "BUY",
					"float_profit": -1650,
					"memo": "",
					"volume": 1,
				}
			}


			var tpl = '<ion-list>';
			for(var pos_id in $scope.other_pos){
				var pos = $scope.other_pos[pos_id];
				tpl += '<ion-checkbox>';
				if(pos.direction == "BUY"){
					tpl += '看涨持仓';
				}else if(pos.direction == "SELL"){
					tpl += '看跌持仓';
				}
				tpl += pos.volume + '手 浮动盈亏';
				tpl +=  pos.float_profit;
				tpl += '</ion-checkbox>';
			}
			tpl += '</ion-list>';

			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				template: tpl,
				cssClass: "full-block",
				title: '请选择持仓',
				subTitle: '选择持仓,查看行情。',
				scope: $scope,
				buttons: [
					{text: '取消'},
					{
						text: '<b>确认</b>',
						type: 'button-positive',
						onTap: function (e) {
							if (!$scope.data.searchinsid) {
								e.preventDefault();
							} else {
								return $scope.data.searchinsid;
							}
						}
					}
				]
			});

			myPopup.then(function (res) {
				// 检查是否有这个合约
				// 1 有 -> 跳转详情页

				// 2 没有 -> popup 提示
				var alertPopup = $ionicPopup.alert({
					title: '未找到合约!',
					template: '未找到合约,请检查输入的合约。',
					okText: '好的',
					okType: 'button-positive'
				});

				alertPopup.then(function (res) {
					console.log('alert end');
				});
			});
		}

		// 1.未登录
		// 2.登录
		// 2.1.有持仓
		// 2.2.无持仓

		$scope.$on("$ionicView.afterEnter", function (event, data) {

//			$scope.other_pos = DM.datas.page_pos_detail.others_pos;

			$scope.iscustom = CustomListService.isCustom($rootScope.$state.params.insid);


			DM.update_data({
				"state": {
					"page_id_local": "page_posdetail",
					"ins_id": $rootScope.$state.params.insid,
					"pos_id": $rootScope.$state.params.posid
				}
			});

			var o = {};
			o[$scope.title] = '';

			console.log(o)

			WS.send({
				aid: "switch_page",
				state: {
					page_id: "page1",
					ins_list: o,
					ins_id: $rootScope.$state.params.insid,
					pos_id: $rootScope.$state.params.posid
				}
			});
		});


		$scope.makeorder = {}

		$scope.insert_order = function (direction) {

			if (!$scope.makeorder.hands) {
				alert("请填写手数")
				return;
			}

			var price_type = 'MARKET';
			var price = 0;

			if ($scope.makeorder.price) {
				price_type = 'LIMIT';
				price = $scope.makeorder.price;
			}

			WS.send({
				aid: "req_insert_order", // 下单请求
				instrument_id: $scope.title,
				direction: direction,
				offset: 'OPEN',
				volume: $scope.makeorder.hands,
				price_type: price_type, // 报单类型
				price: price
			});
		}

		$scope.onSwipeUp = function (e) {
			$ionicLoading.show({
				template: 'Loading...',
				noBackdrop: false,
				hideOnStateChange: true
			}).then(function () {
				$rootScope.$state.go('app.posdetail', {insid: 'ui2342'});
				console.log("The loading indicator is now displayed");
			});
		}
		$scope.onSwipeDown = function (e) {
			console.log('onSwipeDown');
			$ionicLoading.show({
				template: 'Loading...',
				noBackdrop: false,
				hideOnStateChange: true
			}).then(function () {
				$rootScope.$state.go('app.posdetail', {insid: '上一页'});
				console.log("The loading indicator is now displayed");
			});
		}
	}])
