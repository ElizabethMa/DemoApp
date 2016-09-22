var DOMAIN = "192.168.1.64";
var SETTING = {
	server_base_url: 'http://' + DOMAIN,
	sim_server_url: 'ws://' + DOMAIN + '/t/sim/front/mobile',
	act_server_url: 'ws://' + DOMAIN + '/t/act/front/mobile',

	posdetail_cellwidth: 100,
	posdetail_cellheight: 60,
};

var PATH = {
	page_id : 'state.page_id_local',  // state.page_id
	ins_type : 'state.ins_type', // state.ins_type
	ins_list : 'state.ins_list',
	detail_pos_id : 'state.pos_id',
	detail_ins_id : 'state.ins_id',
};

var CONST = {
	// 不包括 自选合约
	ins_type: {
		'main':'主力合约',
		'black':'黑色金属'
	},

	// 自选合约列表
	ins_list_custom: 'cu1612,T1612',

	// 合约代码 合约名称 两列是固定的 insid name
	quote_cols_odd: [
		// {id:'insid', name: '合约代码'},
		{id:'last_price', name: '最新价'},
		{id:'bid_price1', name: '买价'},
		{id:'ask_price1', name: '卖价'},
		{id:'highest', name: '最高价'},
		{id:'volume', name: '成交量'},
		{id:'pre_close', name: '昨收盘'}
	],
	quote_cols_even: [
		// {id:'name', name: '合约名称'},
		{id:'updown_percent', name: '涨跌幅'},
		{id:'bid_volume1', name: '买量'},
		{id:'ask_volume1', name: '卖量'},
		{id:'lowest', name: '最低价'},
		{id:'oi', name: '持仓量'},
		{id:'open', name: '今开盘'}
	],

	// 账户持仓
	positions_account: ['balance','using','available','risk_ratio','position_volume','float_profit'],
	positions_attrs: [
		{id:'position_id', name: '持仓代码'},
		{id:'instrument_id', name: '合约代码'},
		{id:'direction', name: '方向', enum: ['SELL','BUY']},
		{id:'float_profit', name: '盈亏'},
		{id:'frozen_volume', name: '平未成'},
		{id:'last_price', name: '最新价'},
		{id:'margin', name: '占用资金'},
		{id:'open_price', name: '成本'},
		{id:'pending_open_volume', name: '开未成'},
		{id:'volume', name: '手数'}
	],

	// 持仓详情
	pos_detail: ['position_id','direction','float_profit','open_price','volume'],
	pos_quote: ['instrument_id','name',,'ask_price1','bid_price1','ask_volume1','bid_volume1','last_price','updown_percent','updown','highest','lowest','lower_limit','upper_limit','open','close','volume','oi','pre_close','avg_price'],
	pos_orders_attrs: [
		{id:'order_code', name: '挂单代码'}, // session_id + '!' + order_id
		{id:'order_id', name: '挂单代码'},
		{id:'session_id', name: '挂单代码'},
		{id:'direction', name: '方向', enum: ['SELL','BUY']},
		{id:'offset', name: '操作', enum: ['OPEN','CLOSE','CLOSETODAY'] }, // 开仓 平仓
		{id:'price_type', name: '价格类型', enum: ['MARKET','LIMIT']},
		{id:'price', name: '价格'},
		{id:'volume_left', name: '未成交手数'}
	],
	pos_others: [
		{id:'position_id', name: '持仓代码'},
		{id:'direction', name: '方向', enum: ['SELL','BUY']},
		{id:'float_profit', name: '盈亏'},
		{id:'volume', name: '手数'}
	]
};

var DIVISIONS = {};
