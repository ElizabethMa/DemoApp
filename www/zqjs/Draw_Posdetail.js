function draw_page_posdetail() {
	if(DM.get_data('state.page_id_local') === "page_posdetail"){
		for(var i=0; i<CONSTANT.pos_detail.length; i++){
			var unit = CONSTANT.pos_detail_units[i];
			DM.run(function(p, unit){return function(){draw_page_posdetail_content(p, unit)};}(CONSTANT.pos_detail[i], unit));
		}
		DM.run(draw_page_posdetail_poslist);
	}
}

function draw_page_posdetail_content( param , unit){
	var insid = DM.get_data("state.pos_id");
	var div = document.querySelector('.posdetail .'+param);
	var url = "page1.account.positions."+insid+'.'+param;
	console.log(DM.get_data(url));
	div.innerHTML = DM.get_data(url);
}

function draw_page_posdetail_poslist(){
	var container = document.querySelector('.posdetail .pos-boxes');
	var insid = DM.get_data("state.ins_id");
	var posid = DM.get_data("state.pos_id");

	var allOrders = DM.get_data("page1.account.orders");
	var orders = {};
	for(var order_id in allOrders){
		if(allOrders[order_id].position_id == posid){
			orders[order_id] = allOrders[order_id];
		}
	}

	var allPositions = DM.get_data("page1.account.positions");
	var positions = {};
	for(var pos_id in allPositions){
		if(allPositions[pos_id].instrument_id == insid){
			positions[pos_id] = allPositions[pos_id];
		}
	}
	// TODO positions 同合约持仓
//	console.log(positions);


	var counts = Object.getOwnPropertyNames(orders).length;

	// TODO cell_height cell_width
	var restHeight = parseInt(container.style.height);
	var rowNum = Math.floor(restHeight / 60);
	var minColNum = Math.ceil(window.innerWidth / 100);
	var colNum = Math.ceil(counts/rowNum);
	var lastColNum = colNum - counts % rowNum;
	if(minColNum > colNum){
		document.querySelector('.posdetail .pos-boxes').style.width =  (minColNum * 100 )+'px';
	}else{
		document.querySelector('.posdetail .pos-boxes').style.width =  (colNum * 100 )+'px';
	}

	var s = '';

	for(var order_id in orders){
		var order = orders[order_id];
		if(order.direction == 'BUY'){
			s += '<div class="pos-box red">';
		}else if(order.direction == 'SELL'){
			s += '<div class="pos-box green">';
		}
		if(order.price_type == 'LIMIT'){
			s += order.price+'<br/>';
		}else if(order.price_type == 'MARKET'){
			s += '市价<br/>';
		}
		if(order.direction == 'BUY'){
			s += '买';
		}else if(order.direction == 'SELL'){
			s += '卖';
		}
		if(order.offset == 'OPEN'){
			s += '开仓';
		}else if(order.offset == 'CLOSE' || order.offset == 'CLOSE_TODAY'){
			s += '平仓';
		}
		s += order.volume_left +'手</div>';
	}

	container.innerHTML = s;
}