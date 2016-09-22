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

		if(keys.length == 0){
			this.valid = false;
			this.value = {};
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

		dmp.$get = [ function () {
			return new $datamanagerService(dmp.$$config);
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
		dms.$$current_node = null;
		dms.$$root_node = null;

		dms.$init = function () {
			console.log(arguments);
			var node = new DepNode(arguments);
			dms.$$current_node = dms.$$root_node = node;
			return dms;
		};

		dms.$run = function () {
			var node;
			var old_node = dms.$$current_node;
			if(arguments[0] === undefined){
				node = dms.$$current_node;
			}else{
				node = new DepNode(arguments);
				dms.$$current_node.children.push(node);
				dms.$$current_node = node;  // bug
			}
			node.value();
			dms.$$current_node = old_node;
			return dms;
		};

		dms.$rerun = function (node) {
			if(node instanceof DepNode){
				dms.$$current_node = node;
				if(node.invalid){
					dms.$$current_node.children = [];
					dms.$$current_node.invalid = false;
					dms.$$current_node.value();
					return ;
				}
			}else{
				throw new TypeError('argument should be DepNode');
			}
			var child_nodes = dms.$$current_node.children;
			for(var i=0; i<child_nodes.length; i++){
				dms.$rerun(child_nodes[i]);
			}
		};

		dms.$update_data = function (uri, value) {
			var data_node = dms.$$datas.get_node(uri);
			// 更新节点数据
			data_node.set_value(value);
			// 更新依赖关系
			for (var i=0; i<data_node.deps.length; i++){
				data_node.deps[i].invalid = true;
			}
			return dms;
		};

		dms.$get_data = function (uri) {
			var data_node = dms.$$datas.get_node(uri);
			// 将 current_node 和对应数据 加到 data_relation 中
			if(data_node.deps.length ==0 ){
				data_node.deps.push(dms.$$current_node);
			}else{
				for (var i=0; i<data_node.deps.length; i++){
					if(data_node.deps[i].value.name == dms.$$current_node.value.name){
						break;
					}
				}
				if(i == data_node.deps.length){
					data_node.deps.push(dms.$$current_node);
				}
			}
			return data_node.get_value();
		};
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
