var CONSTANT = {
	// 不包括 自选合约
	inslist_type:{ main:'主力合约', all:'全部合约'},
	// 自选合约列表
	inslist_custom_insid: ['cu1612', 'T1612'],
	// 合约代码 合约名称 两列是固定的 insid name
	inslist_cols_odd_name:['最新价', '买价', '卖价', '最高价', '成交量', '昨收盘'],
	inslist_cols_even_name:['涨跌幅', '买量', '卖量', '最低价', '持仓量', '今开盘'],
	inslist_cols_odd:['last_price', 'bid_price1', 'ask_price1', 'highest', 'volume', 'pre_close'],
	inslist_cols_even:['updown_percent', 'bid_volume1', 'ask_volume1', 'lowest', 'oi', 'open'],

	// 账户持仓
	pos_acocunt: ['balance','using','available','risk_ratio','position_volume','float_profit'],
	pos_acocunt_units: ['','','','%','',''],

	// 持仓详情
	pos_detail: ['last_price','updown_percent','updown','ask_price1','bid_price1','ask_volume1','bid_volume1','highest','lowest','lower_limit','upper_limit','open','close','volume','oi','pre_close','avg_price'],
	pos_detail_units: ['','','','','','','','','','','','','','','','','']

}

var CURRENT_STATE = {}
/**
 * 格式化数字用来显示
 * @param format {
 *          decimal: 0 , //保留小数位数
 *          prefix: '', //前缀 ( 'sign'(+、-) , '$', .....)
 *          postfix: '' //后缀 ('%'(*100), '元', .....)
 *          }
 * @returns {string}
 * @constructor
 */
function NumberToString(number, format){
	var config = {
			decimal: 0 ,
			prefix: '',
			postfix: ''
	};
	config = angular.extend({}, config, format);
	var sNum = '';
	if(typeof number == 'number'){
		if(config.postfix == '%'){ number = number * 100}
		sNum = number.toFixed(config.decimal);

		var aIntNum = sNum.toString().split(".");
		if (aIntNum[0].length >= 5) {
			aIntNum[0] = aIntNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		}
		sNum = aIntNum.join(".");


		if(number > 0 && config.prefix == 'sign'){
			sNum = '+' + sNum;
		}
		return sNum + config.postfix;
	}else{
		return '';
	}
}


function draw_app(){
	DM.run(draw_page_quote);
	DM.run(draw_page_position);
	DM.run(draw_page_posdetail);
}

DM.init(draw_app);
