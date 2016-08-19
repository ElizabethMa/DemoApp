/**
 * Created by yanqiong on 8/12/16.
 */

/**
 * define DepNode
 * @constructor
 * @params function arguments_list
 */

var DepNode = function(param){
	if(typeof param[0] === 'function'){
		var s = 'param[0].bind(';
		var i = 0;
		for(var i=0; i<param.length; i++){
			s += 'param[' + i + ']';
			if(i === (param.length-1)){
				s += ');'
			}else{
				s += ','
			}
		}
		this.value = eval(s);
		this.invalid = false;
		this.children = [];
	}else{
		throw new TypeError('first argument must be function');
	}
}

/**
 * define DataNode
 * @param type
 * @param path
 * @constructor
 */
var DataNode = function(path){
	// 构造函数
	this.path = path;
	this.value = {};
	this.parents = null;
	this.valid = true;
	this.deps = [];
}

DataNode.prototype.root = new DataNode(['root']);

DataNode.prototype.get_node = function(uri){
	var path = uri.split('.');
	var root = this.root;
	for(var i=1; i<path.length; i++){
		if(root.value[path[i]] === undefined) {
			var node = new DataNode(path.slice(0, i + 1));
			node.parents = root;
			node.valid = false;
			root.value[path[i]] = node;
		}
		root = root.value[path[i]];
	}
	return root;
}

DataNode.prototype.set_value = function(val){
	this.valid = false;

	if(typeof val === 'object'){
		var keys = Object.getOwnPropertyNames(val);
		for(var i=0; i<keys.length; i++){
			var path = this.path.slice();
			path.push(keys[i]);

			if(this.value[keys[i]] === undefined){
				var node = new DataNode(path);
				node.valid = false;
				node.parents = this;

				this.value[keys[i]] = node;
			}

			if(typeof val[keys[i]] === 'number' || typeof val[keys[i]] === 'string'){
				this.value[keys[i]].set_single_value(val[keys[i]]);
			}else{
				this.value[keys[i]].set_object_value(val[keys[i]]);
			}
		}
	}else if(typeof val === 'number' || typeof val === 'string'){
		this.set_single_value(val);
	}
}

DataNode.prototype.set_single_value = function(val){
	if(this.value !== val){
		this.valid = false;
		this.value = val;
	}
};

DataNode.prototype.set_object_value = function(val){
	this.valid = false;
	var keys = Object.getOwnPropertyNames(val);
	for(var i=0; i<keys.length; i++){
		var path = this.path.slice();
		path.push(keys[i]);

		if(this.value[keys[i]] === undefined){
			var node = new DataNode(path);
			node.valid = false;
			node.parents = this;

			this.valid = false;

			this.value[keys[i]] = node;
		}

		if(typeof val[keys[i]] === 'number' || typeof val[keys[i]] === 'string'){
			this.value[keys[i]].set_single_value(val[keys[i]]);
		}else{
			this.value[keys[i]].set_object_value(val[keys[i]]);
		}
	}
};

DataNode.prototype.get_value = function(){

	if(typeof this.value === 'number' || typeof this.value === 'string'){
		this.valid = true;
		return this.value;
	}else{
		var obj = {};
		var keys = Object.getOwnPropertyNames(this.value);
		for(var i=0; i<keys.length; i++){
			obj[keys[i]] = this.value[keys[i]].get_value();
		}
		this.valid = true;
		return obj;
	}
};

/***** end define DataNode *****/

var CreateManager = function(){
	this.root_node = null;
	this.current_node = null;
	// 全局使用同一个数据集
	this.datas = DataNode.prototype.root;
};

CreateManager.prototype.init = function(){
	var node = new DepNode(arguments);
	this.root_node = this.current_node = node;
	return this;
};

CreateManager.prototype.run = function(){
	var node;
	var old_node = this.current_node;
	if(arguments[0] === undefined){
		node = this.current_node;
	}else{
		node = new DepNode(arguments);
		this.current_node.children.push(node);
		this.current_node = node;  // bug
	}
	node.value();
	this.current_node = old_node;
	return this;
};

CreateManager.prototype.rerun = function(node){
	if(node instanceof DepNode){
		this.current_node = node;
		if(node.invalid){
			this.current_node.children = [];
			this.current_node.invalid = false;
			this.current_node.value();
			return ;
		}
	}else{
		throw new TypeError('argument should be DepNode');
	}
	var child_nodes = this.current_node.children;
	for(var i=0; i<child_nodes.length; i++){
		this.rerun(child_nodes[i]);
	}
};

CreateManager.prototype.update_data = function(uri, value){
	var data_node = this.datas.get_node(uri);
	// 更新节点数据
	data_node.set_value(value);
	// 更新依赖关系
	for (var i=0; i<data_node.deps.length; i++){
		data_node.deps[i].invalid = true;
	}
	return this;
};

CreateManager.prototype.get_datas = function(uri){
	var data_node = this.datas.get_node(uri);
	// 将 current_node 和对应数据 加到 data_relation 中
	if(data_node.deps.length ==0 ){
		data_node.deps.push(this.current_node);
	}else{
		for (var i=0; i<data_node.deps.length; i++){
			if(data_node.deps[i].value.name == this.current_node.value.name){
				break;
			}
		}
		if(i == data_node.deps.length){
			data_node.deps.push(this.current_node);
		}
	}
	return data_node.get_value();
};




'use strict';

(function () {

	function $datamanagerProvider () {
		var dmp = this;

		dmp.$$config = {

		};

		dmp.$setup = function (cfg) {
			cfg = cfg || {};
			dmp.$$config = angular.extend({}, dmp.$$config, dmp);
			return dmp;
		};

		dmp.$get = ['$http', function ($http) {
			return new $datamanagerService(dmp.$$config, $http);
		}];
	}

	/**
	 * @ngdoc service
	 * @name $websocketService
	 * @module ngWebsocketService
	 * @description
	 * HTML5 Websocket service for AngularJS
	 */
	function $datamanagerService (cfg, $http) {
		var dms = this;

		dms.$$datas = new DataNode(['root']);
		dms.$$root_node
		dms.$$current_node = new DataNode(['root']);


		dms.$get = function (url) {
			return dms.$$websocketList[url];
		};

		dms.$new = function (cfg) {
			cfg = cfg || {};

			// Url or url + protocols initialization
			if (typeof cfg === 'string') {
				cfg = {url: cfg};

				// url + protocols
				if (arguments.length > 1) {
					if (typeof arguments[1] === 'string' && arguments[1].length > 0) cfg.protocols = [arguments[1]];
					else if (typeof arguments[1] === 'object' && arguments[1].length > 0) cfg.protocols = arguments[1];
				}
			}

			// If the websocket already exists, return that instance
			var ws = wss.$get(cfg.url);
			if (typeof ws === 'undefined') {
				var wsCfg = angular.extend({}, wss.$$config, cfg);

				ws = new $websocket(wsCfg, $http);
				wss.$$websocketList[wsCfg.url] = ws;
			}

			return ws;
		};
	}

	/**
	 * @ngdoc class
	 * @name $websocket
	 * @module ngWebsocket
	 * @description
	 * HTML5 Websocket wrapper class for AngularJS
	 */
	function $websocket (cfg, $http) {
		var me = this;

		if (typeof cfg === 'undefined' || (typeof cfg === 'object' && typeof cfg.url === 'undefined')) throw new Error('An url must be specified for WebSocket');

		me.$$eventMap = {};
		me.$$ws = undefined;
		me.$$reconnectTask = undefined;
		me.$$reconnectCopy = true;
		me.$$queue = [];
		me.$$config = {
			url: undefined,
			lazy: false,
			reconnect: true,
			reconnectInterval: 2000,
			enqueue: false,
			mock: false,
			protocols: null
		};

		me.$$fireEvent = function () {
			var args = [];

			Array.prototype.push.apply(args, arguments);

			var event = args.shift(),
				handlers = me.$$eventMap[event];

			if (typeof handlers !== 'undefined') {
				for (var i = 0; i < handlers.length; i++) {
					if (typeof handlers[i] === 'function') handlers[i].apply(me, args);
				}
			}
		};

		me.$$init = function (cfg) {

			if (cfg.mock) {
				me.$$ws = new $$mockWebsocket(cfg.mock, $http);
			}
			else if (cfg.protocols) {
				me.$$ws = new WebSocket(cfg.url, cfg.protocols);
			}
			else {
				me.$$ws = new WebSocket(cfg.url);
			}

			me.$$ws.onmessage = function (message) {
				try {
					var decoded = JSON.parse(message.data);
					me.$$fireEvent(decoded.event, decoded.data);
					me.$$fireEvent('$message', decoded);
				}
				catch (err) {
					me.$$fireEvent('$message', message.data);
				}
			};

			me.$$ws.onerror = function (error) {
				me.$$fireEvent('$error', error);
			};

			me.$$ws.onopen = function () {
				// Clear the reconnect task if exists
				if (me.$$reconnectTask) {
					clearInterval(me.$$reconnectTask);
					delete me.$$reconnectTask;
				}

				// Flush the message queue
				if (me.$$config.enqueue && me.$$queue.length > 0) {
					while (me.$$queue.length > 0) {
						if (me.$ready()) me.$$send(me.$$queue.shift());
						else break;
					}
				}

				me.$$fireEvent('$open');
			};

			me.$$ws.onclose = function () {
				// Activate the reconnect task
				if (me.$$config.reconnect) {
					me.$$reconnectTask = setInterval(function () {
						if (me.$status() === me.$CLOSED) me.$open();
					}, me.$$config.reconnectInterval);
				}

				me.$$fireEvent('$close');
			};

			return me;
		};

		me.$CONNECTING = 0;
		me.$OPEN = 1;
		me.$CLOSING = 2;
		me.$CLOSED = 3;

		// TODO: it doesn't refresh the view (maybe $apply on something?)
		/*me.$bind = function (event, scope, model) {
		 me.$on(event, function (message) {
		 model = message;
		 scope.$apply();
		 });
		 };*/

		me.$on = function () {
			var handlers = [];

			Array.prototype.push.apply(handlers, arguments);

			var event = handlers.shift();
			if (typeof event !== 'string' || handlers.length === 0) throw new Error('$on accept two parameters at least: a String and a Function or an array of Functions');

			me.$$eventMap[event] = me.$$eventMap[event] || [];
			for (var i = 0; i < handlers.length; i++) {
				me.$$eventMap[event].push(handlers[i]);
			}

			return me;
		};

		me.$un = function (event) {
			if (typeof event !== 'string') throw new Error('$un needs a String representing an event.');

			if (typeof me.$$eventMap[event] !== 'undefined') delete me.$$eventMap[event];

			return me;
		};

		me.$$send = function (message) {
			if (me.$ready()) me.$$ws.send(JSON.stringify(message));
			else if (me.$$config.enqueue) me.$$queue.push(message);
		};

		me.$emit = function (event, data) {
			if (typeof event !== 'string') throw new Error('$emit needs two parameter: a String and a Object or a String');

			var message = {
				event: event,
				data: data
			};

			me.$$send(message);

			return me;
		};

		me.$open = function () {
			me.$$config.reconnect = me.$$reconnectCopy;

			if (me.$status() !== me.$OPEN) me.$$init(me.$$config);
			return me;
		};

		me.$close = function () {
			if (me.$status() !== me.$CLOSED) me.$$ws.close();

			if (me.$$reconnectTask) {
				clearInterval(me.$$reconnectTask);
				delete me.$$reconnectTask;
			}

			me.$$config.reconnect = false;

			return me;
		};

		me.$status = function () {
			if (typeof me.$$ws === 'undefined') return me.$CLOSED;
			else return me.$$ws.readyState;
		};

		me.$ready = function () {
			return me.$status() === me.$OPEN;
		};

		me.$mockup = function () {
			return me.$$config.mock;
		};

		// setup
		me.$$config = angular.extend({}, me.$$config, cfg);
		me.$$reconnectCopy = me.$$config.reconnect;

		if (!me.$$config.lazy) me.$$init(me.$$config);

		return me;
	}

	function $$mockWebsocket (cfg, $http) {
		cfg = cfg || {};

		var me = this,
			openTimeout = cfg.openTimeout || 500,
			closeTimeout = cfg.closeTimeout || 1000,
			messageInterval = cfg.messageInterval || 2000,
			fixtures = cfg.fixtures || {},
			messageQueue = [];

		me.CONNECTING = 0;
		me.OPEN = 1;
		me.CLOSING = 2;
		me.CLOSED = 3;

		me.readyState = me.CONNECTING;

		me.send = function (message) {
			if (me.readyState === me.OPEN) {
				messageQueue.push(message);
				return me;
			}
			else throw new Error('WebSocket is already in CLOSING or CLOSED state.');
		};

		me.close = function () {
			if (me.readyState === me.OPEN) {
				me.readyState = me.CLOSING;

				setTimeout(function () {
					me.readyState = me.CLOSED;

					me.onclose();
				}, closeTimeout);
			}

			return me;
		};

		me.onmessage = function () {};
		me.onerror = function () {};
		me.onopen = function () {};
		me.onclose = function () {};

		setInterval(function () {
			if (messageQueue.length > 0) {
				var message = messageQueue.shift(),
					msgObj = JSON.parse(message);

				switch (msgObj.event) {
					case '$close':
						me.close();
						break;
					default:
						// Check for a custom response
						if (typeof fixtures[msgObj.event] !== 'undefined') {
							msgObj.data = fixtures[msgObj.event].data || msgObj.data;
							msgObj.event = fixtures[msgObj.event].event || msgObj.event;
						}

						message = JSON.stringify(msgObj);

						me.onmessage({
							data: message
						});
				}
			}
		}, messageInterval);

		var start = function (fixs) {
			fixs = fixs || {};
			fixs = fixs instanceof Error ? {} : fixs;

			fixtures = fixs;

			setTimeout(function () {
				me.readyState = me.OPEN;
				me.onopen();
			}, openTimeout);
		};

		// Get fixtures from a server or a file if it's a string
		if (typeof fixtures === 'string') {
			$http.get(fixtures)
				.success(start)
				.error(start);
		}
		else start(fixtures);

		return me;
	}

	/**
	 * @ngdoc module
	 * @name $datamanager
	 * @module ngDataManager
	 * @description
	 * DataManager module for AngularJS
	 */
	angular
		.module('ngDataManager', [])
		.provider('$datamanager', $datamanagerProvider);
})();
