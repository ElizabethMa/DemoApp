(function () {
	var ws = undefined;
	var server_url = '';
	var queue = [];

	// 自动重连开关
	var reconnect = true;
	var reconnectTask;
	var reconnectInterval = 2000;

	// 记录最近一次发送的内容
	var lastSendContent;

	var CONNECTING = 0;
	var OPEN = 1;
	var CLOSING = 2;
	var CLOSED = 3;

	function init(url) {
		if (typeof url == 'string' && url != server_url) {
			server_url = url;
		}
		ws = new WebSocket(server_url);
		ws.onmessage = function (message) {
			var decoded = JSON.parse(message.data);
			// update datamanager
			if (decoded.aid == "rtn_data") {
				for (var i = 0; i < decoded.data.length; i++) {
					var temp = decoded.data[i];
					DM.update_data(temp);
				}
			}
			// send peek_message
			if (isReady()) ws.send('{"aid":"peek_message"}');
		};
		ws.onclose = function () {
			// 清空 datamanager
			DM.clear_data();
			// 自动重连
			if (reconnect) {
				reconnectTask = setInterval(function () {
					if (ws.readyState === CLOSED) init();
				}, reconnectInterval);
			}
		};
		ws.onerror = function (error) {
			console.error(error);
		};
		ws.onopen = function () {
			if (reconnectTask) {
				clearInterval(reconnectTask);
			}
			if (queue.length > 0) {
				while (queue.length > 0) {
					if (isReady()) send(queue.shift());
					else break;
				}
			}
			// send peek_message
			if (isReady()) ws.send('{"aid":"peek_message"}');
		};
	}

	function isReady() {
		if (typeof ws === 'undefined') return false;
		else return ws.readyState === OPEN;
	}

	function send(message) {
		if (isReady()) {
			ws.send(JSON.stringify(message));
			lastSendContent = message;
		}
		else queue.push(message);
	}

	this.WS = {
		init: init,
		send: send,
		getLastState: function () {
			return lastSendContent.state;
		}
	}
}());

// test
//WS.init('ws://192.168.1.64:80/t/sim/front/mobile');
//WS.send({
//	aid: "switch_page",
//	state: {
//		page_id: "page1",
//      ins_type: "",
//		ins_list: {
//			cu1612 : "",
//			T1612: "",
//			c1701:""
//		},
//      ins_id: "",
//      pos_id: ""
//	}
//});