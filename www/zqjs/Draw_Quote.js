/**
 *  DIVISIONS
 */

function draw_page_quote() {
	if(DM.get_data(PATH.page_id) === "page_quote"){
		var container = document.querySelector('.inslist_type_' + DM.get_data(PATH.ins_type) + ' table.qt tbody');
		var container_qt_c = document.querySelector('.inslist_type_'+ DM.get_data(PATH.ins_type) +' .qt_cwrapper' +
			' tbody');
		if(container){
			container.innerHTML = '';
			container_qt_c.innerHTML = '';

//		var ins_list = DM.get_data("state.ins_list").split(',');
			if(DM.get_data("state.ins_list")){
				var ins_list = Object.getOwnPropertyNames(DM.get_data("state.ins_list"));
				var quotes_showed = container.querySelectorAll('tr');

				for (var i = 0; i < ins_list.length; i++) {
					if(container.querySelectorAll('.'+ins_list[i]).length == 0)
						DM.run(function(insid){return function(){draw_page_quote_line(insid)};}(ins_list[i]));
					DM.run(function(insid){return function(){draw_page_quote_detail(insid)};}(ins_list[i]));
				}
			}
		}
	}
}

function draw_page_quote_line(insid){
	var insid_name = DM.get_data("page_quotelist.quotes."+insid+'.name');
	var container = document.querySelector('.inslist_type_'+ DM.get_data(PATH.ins_type) +' table.qt tbody');
	var container_qt_c = document.querySelector('.inslist_type_'+ DM.get_data(PATH.ins_type) +' .qt_cwrapper' +
		' tbody');
	if (container.querySelectorAll('tr.' + insid).length === 0) {
		// need paint the tr - .insid = quotes_keys[i]
		var tr_odd = document.createElement('tr'),
			tr_even = document.createElement('tr');
		tr_odd.className = 'odd ' + insid;
		tr_even.className = 'even ' + insid;
		tr_odd.addEventListener('click',function(){
			location.href = "#/app/posdetail/" + insid + '/';
		});
		tr_even.addEventListener('click',function(){
			location.href = "#/app/posdetail/" + insid + '/';
		});
		var temp = "<td>" + insid + "</td>";
		for(var i=0; i<CONSTANT.inslist_cols_odd.length; i++){
			temp += "<td class='" + insid + "_" + CONSTANT.inslist_cols_odd[i] + "'></td>"
		}
		tr_odd.innerHTML = temp;
		temp = "<td>" + insid_name + "</td>";
		for(var i=0; i<CONSTANT.inslist_cols_even.length; i++){
			temp += "<td class='" + insid + "_" + CONSTANT.inslist_cols_even[i] + "'></td>"
		}
		tr_even.innerHTML = temp;
		container.appendChild(tr_odd);
		container.appendChild(tr_even);

		var qt_c_tr_odd = document.createElement('tr'),
			qt_c_tr_even = document.createElement('tr');
		qt_c_tr_odd.className = 'odd ' + insid;
		qt_c_tr_even.className = 'even ' + insid;
		qt_c_tr_odd.innerHTML = "<td>" + insid + "</td>";
		qt_c_tr_even.innerHTML = "<td>" + insid_name + "</td>";
		container_qt_c.appendChild(qt_c_tr_odd);
		container_qt_c.appendChild(qt_c_tr_even);
	}// 画合约行
}

function draw_page_quote_detail(insid){
	var quote = DM.get_data("page1.quotes."+insid);
	var keys = CONSTANT.inslist_cols_odd.concat(CONSTANT.inslist_cols_even);
	for (var i = 0; i < keys.length; i++) {
		var div = document.querySelector('.inslist_type_'+ DM.get_data(PATH.ins_type) +' table.qt tbody .' + insid + '_' + keys[i]);
//		var div = document.getElementById(insid + '_' + keys[i]);
		if (div) {
			var val = quote[keys[i]] == undefined ? '' : quote[keys[i]];
//			var arr = val.split('|');
//			div.innerText = arr[0];
			div.innerText = val;
//			div.className = arr[1];
		}
	}
}

