function stripscript(s){ 
	var pattern = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\￥\\\/;'\[\]]/im;
	var rs = ""; 
	for (var i = 0; i < s.length; i++) { 
		rs = rs+s.substr(i, 1).replace(pattern, ''); 
	} 
	return rs; 
};

(function(){
	if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (cls) {
            var ret = [];
            var els = document.getElementsByTagName('*');
            for (var i = 0, len = els.length; i < len; i++) {

                if (els[i].className.indexOf(cls + ' ') >=0 || els[i].className.indexOf(' ' + cls + ' ') >=0 || els[i].className.indexOf(' ' + cls) >=0) {
                    ret.push(els[i]);
                }
            }
            return ret;
        }
    };
	var oBox = document.getElementById('box');
	var oCheckAll = document.getElementsByClassName('check-all');
	var itemTotal = document.getElementsByClassName('item-total');
	var oSelected = document.getElementById('selected');
	var selectedNum = oSelected.getElementsByTagName('em')[0];
	var oArrow = oSelected.getElementsByTagName('span')[1];
	var itemList = document.getElementById('item-list').getElementsByTagName('ul')[0];
	var total = document.getElementById('total');
	var oPop = document.getElementById('popup');
	var tr = oBox.children[1].rows;
	var Odel = document.getElementById('delSel');
	var oPay= document.getElementById('pay');
	var oTbody = oBox.getElementsByTagName('tbody')[0];
	var subCheck = document.getElementsByClassName('check-one');
	
	
	//全选功能
	for(var i=0; i<oCheckAll.length; i++){
		oCheckAll[i].onclick = function(){
			for(var j=0; j<subCheck.length; j++){
				subCheck[j].checked = this.checked;
				if(this.checked){
					subCheck[j].parentNode.parentNode.className = "on";
				}
				else{
					subCheck[j].parentNode.parentNode.className = "";
				}
			}
			for(var k=0; k<oCheckAll.length; k++){
				oCheckAll[k].checked = this.checked;
			}
			getItemTotal();
			if(selectedNum.innerHTML != 0){
				oPay.className = "pay active";
			}
			else{
				oPay.className = "pay";
			};
		}
	};
	
	//弹出商品浮层
	oSelected.onclick = function(){
		if(oPop.style.display == "none"){
			if(selectedNum.innerHTML != 0){
				oPop.style.display = "block";
				oArrow.className = "arrow down";
			}
		}else{
			oPop.style.display = "none";
			oArrow.className = "arrow";
		};
	};
	
	//取消选择
	itemList.onclick = function(ev){
		var oEvent = ev || event;
		var oSrc = oEvent.srcElement || oEvent.target;
		if(oSrc.tagName == "A"){
			var index = oSrc.getAttribute('index');
			var check = tr[index].getElementsByTagName('input')[0];
			check.checked = false;
			check.onclick();
		};
	};
	
	//计算总价
	function getItemTotal(){
		var selected = 0;
		var price = 0;
		var itemStr = '';
		for(var i=0; i<tr.length; i++){
			if(tr[i].getElementsByTagName('input')[0].checked){
				var s = stripscript(tr[i].cells[4].innerHTML);
				selected += parseInt(tr[i].getElementsByTagName('input')[1].value);
				price += parseFloat(s);
				itemStr += '<li><img src="'+ tr[i].getElementsByTagName('img')[0].src +'" /><a index="'+i+'">取消选择</a></li>';
			}
		}
		if(selected == 0){
			oPop.style.display = "none";
		}
		selectedNum.innerHTML = selected;
		total.innerHTML = "合计（不含运费）：<span>￥</span><em>" + price.toFixed(2) + "</em>";
		itemList.innerHTML = itemStr;
	};
	
	//商品小计
	function getSubTotal(tr){
		var aTd = tr.cells;
		var input = tr.getElementsByTagName('input')[1];
		var s = stripscript(aTd[2].innerHTML);
		var price = parseFloat(s);
		var count = parseInt(input.value); 
		var subTotal = parseFloat(price * count).toFixed(2);
		//console.log(subTotal);
		aTd[4].innerHTML = "￥" + subTotal;
	};
	
	//创建Tr节点
	function creatTr(img, title, price, count){
		var oTr = document.createElement('tr');
		var s = stripscript(price);
		oTr.innerHTML = '<td><input class="check-one" type="checkbox" /></td>\
			<td class="item-box">\
				<img src="'+ img +'" />\
				<span class="item-name">\
					<a href="javascript:;">'+ title +'</a>\
				</span>\
			</td>\
			<td class="price">'+ price +'</td>\
			<td class="num">\
				<div class="conut-box">\
					<span class="reduce"></span><input class="count" type="text" value="'+ count +'" maxlength="3" /><span class="add">+</span>\
				</div>\
			</td>\
			<td class="item-total">￥'+ parseFloat(s) * parseInt(count) +'</td>\
			<td><a class="del" href="javasript:;">删除</a></td>';
			
			
			return oTr;
	};
	
	//获取页面数据
	function getData(){
		oTbody.innerHTML = '';
		for(var i=0; i<arr.length; i++){
			var oTr = creatTr(arr[i].img, arr[i].title, arr[i].price, arr[i].count);
			console.log(oTr);
			oTbody.appendChild(oTr);
		};
	};
	getData();
	
	//数量操作
	for(var i=0; i<tr.length; i++){
		tr[i].onclick = function(ev){
			var oEvent = ev || event;
			var oSrc = oEvent.srcElement || oEvent.target;
			var cls = oSrc.className;
			var input = this.getElementsByTagName('input')[1];
			var val = parseInt(input.value);
			var reduce = this.getElementsByClassName('reduce')[0];
			switch(cls){
				case 'add':
					input.value = val + 1;
					reduce.innerHTML = "-";
					getSubTotal(this);
					break;
				case 'reduce':
					if(input.value > 1){
						input.value = val - 1;
					};
					if(input.value <= 1){
						reduce.innerHTML = "";
					};
					getSubTotal(this);
					break;
				case 'del':
					var conf = window.confirm('确认删除吗？');
					if(conf){
						this.parentNode.removeChild(this);
					};
					break;
				default:
					break;
			};
			getItemTotal();
		};
		
		tr[i].getElementsByTagName('input')[1].onkeyup = function(){
			var val = parseInt(this.value);
			var tr = this.parentNode.parentNode.parentNode;
			var reduce = tr.getElementsByClassName('reduce')[0];
			if(isNaN(val) || val < 1){
				val = 1;
			};
			this.value = val;
			if(val <= 1){
				reduce.innerHTML = '';
			}
			else{
				reduce.innerHTML = '-';
			}
			getSubTotal(this.parentNode.parentNode.parentNode);
			getItemTotal();
		}
	};
	
	//点击复选框
	for(var i=0; i<subCheck.length; i++){
		subCheck[i].onclick = function(){
			var count = 0;
			for(var j=0; j<subCheck.length; j++){
				if(subCheck[j].checked){
					count++;
				}
			}
			if(count == subCheck.length){
				for(var k=0; k<oCheckAll.length; k++){
					oCheckAll[k].checked = true;
				}
			}
			else{
				for(var k=0; k<oCheckAll.length; k++){
					oCheckAll[k].checked = false;
				}
			}
			getItemTotal();
			if(selectedNum.innerHTML != 0){
				oPay.className = "pay active";
				oPay.onclick = function(){
					alert("没钱你还点那么多？");
				}
			}
			else{
				oPay.className = "pay";
			};
			if(this.checked == true){
				this.parentNode.parentNode.className = "on";
			}
			else{
				this.parentNode.parentNode.className = "";
			}
		}
	};
	
	//删除所选
	Odel.onclick = function(){
		if(selectedNum.innerHTML != "0"){
			var conf = window.confirm('确认删除吗？');
			if(conf){
				for(var i=0; i<tr.length; i++){
					var input = tr[i].getElementsByTagName('input')[0];
					if(input.checked){
						tr[i].parentNode.removeChild(tr[i]);
						i--;
					};
				};
				selectedNum.innerHTML = 0;
				total.innerHTML = "合计（不含运费）：<span>￥</span><em>0</em>";
			};
		};
	};
}());