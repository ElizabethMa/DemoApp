function draw_page_position() {
	if(DM.get_data('state.page_id_local') === "page_position"){

		for(var i=0; i<CONSTANT.pos_acocunt.length; i++){
			var unit = CONSTANT.pos_acocunt_units[i];
			DM.run(function(p, unit){return function(){draw_page_position_account(p, unit)};}(CONSTANT.pos_acocunt[i], unit));
		}

		DM.run(draw_page_position_list);
	}
}



function draw_page_position_account( param , unit){
	// 账户资金
	var div = document.querySelector('.pos_container .account_info .'+param);
	div.innerHTML = NumberToString(DM.get_data("page1.account."+param), {decimal: 2 , prefix: '', postfix: unit});
}

function draw_page_position_list(){
	var poslist = DM.get_data("page1.account.positions");
	var container = document.querySelector('.pos_container .pos_list');

	var posArr = [];
	if(poslist){ posArr = Object.getOwnPropertyNames(poslist);}
	var strHtml = '';
	for(var i=0; i<posArr.length; i++){
		if(document.querySelectorAll('.pos_container .pos_list .pos_'+ posArr[i]).length == 0){
			var p = poslist[posArr[i]];
			strHtml = '<div class="list card pos_'+ posArr[i] +'">';
			strHtml += '<a class="item item-divider" href="#/app/posdetail/'+ p.instrument_id +'/'+posArr[i]+'">';
			strHtml += '<div class="row">';
			strHtml += '<div class="col">';
			strHtml += p.instrument_id;

			if(p.direction == 'SELL'){
				strHtml += ' <i class="icon ion-arrow-down-c"></i>'
			}else if(p.direction == 'BUY'){
				strHtml += ' <i class="icon ion-arrow-up-c"></i>'
			}

			strHtml += '</div>';
			strHtml += '<div class="col" align="right">'
				+ NumberToString(p.last_price) +'</div>';
			strHtml += '</div></a>';
			strHtml += '<a class="item" href="#/app/posdetail/'+ p.instrument_id +'/'+ posArr[i] +'">';
			strHtml += '<div class="row">';

			if(p.direction == 'SELL'){
				strHtml += '<div class="col">看跌</div>';
			}else if(p.direction == 'BUY'){
				strHtml += '<div class="col">看涨</div>';
			}


			strHtml += '<div class="col" align="right">'+ p.volume +'手</div>';
			strHtml += '<div class="col col-offset-10">盈亏</div>';
			strHtml += '<div class="col" align="right">'+ p.float_profit +'</div>';
			strHtml += '</div>';
			strHtml += '<div class="row">';
			strHtml += '<div class="col">成本</div>';
			strHtml += '<div class="col" align="right">'+p.open_price+'</div>';
			strHtml += '<div class="col col-offset-10">开未成</div>';
			strHtml += '<div class="col" align="right">'+p.pending_open_volume+'手</div>';
			strHtml += '</div>';
			strHtml += '<div class="row">';
			strHtml += '<div class="col">占用</div>';
			strHtml += '<div class="col" align="right">'+p.margin+'</div>';
			strHtml += '<div class="col col-offset-10">平未成</div>';
			strHtml += '<div class="col" align="right">'+p.frozen_volume+'手</div>';
			strHtml += '</div></a></div>';
			container.innerHTML += strHtml;
		}else{
			DM.run(function(pos_id){return function(){draw_page_position_content(pos_id)};}(posArr[i]));
		}
	}

}

function draw_page_position_content(pos_id){
	console.log('draw_page_position_content ' + pos_id);
	if(DM.get_data('state.page_id_local') === "page_position"){

	}
}