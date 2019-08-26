document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	//console.log(JSON.parse(storage.getItem("userInfo")).Token);
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		UserId:"",
		// 购房意向条件
		city:"",
		area:"",
		current:0,
		currentSub:0,
		RegionList:"",//区域
		cityList:"",//区域ID
		showPrice :"",//均价
		priceList:[],
		showPriceL:"",
		price:"",
		priceName:"请选择均价",
		productList:"",
		dataTotal:"",
		count:1,
		arrSel:[],
		arrSelList:[],
		filtrateList:[],
		tab:"",
		cityListF:"",
		cityListNameF:"",
		sCity:"请选择区域",
		ym:"",//需要跳转的页面
		pSub:0
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
		this.getCity();
		this.getProduct();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted() { //下面表示已执行方法  编译好html后在这操作
	},
	methods:{
		getData:function(a){
			var _this=this;
			_this.ym=_this.getUrlParam('ym');
			// lstorage.setItem("selectedProduct","");
			lstorage.setItem('cityN','0');
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				axios.get("/Attribute/GetAttributeList",{
					params:{
						AttributeType: 9,
						// RegionId:233
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 // _this.RegionList=r.data.data.RegionList;
						 _this.showPrice=r.data.data.Average.AttributeValueList;
						_this.showPrice.unshift({AttributeValueName:'不限'});
							// 均价数据
						_this.showPriceL=r.data.data.Average;						 
					 }else{
						 $.toast(r.data.message, "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							// window.location.href="./index.html";
							}
						 })					 
				 })
			 }else{
				 window.location.href="./login.html";
			 }
		},
    	getCity:function(){
				var _this=this;
				lstorage.setItem('cityName','0');
			// 获取城市
				axios.get("/Region/GetRegionCityOrArea",{
					params:{
						RegionId:19
					}
				})
					.then(function(r){
						// //console.log(r);
						if(r.data.code=='1001'){
							_this.city=r.data.data;
							_this.city.unshift({Name:'不限',ParentId: '-1',RegionId: '-1'});
							_this.changeCity(r.data.data[0].RegionId,0);
						}
					})
					 .catch(function(error){
							$.alert({
								title: '服务器错误',
								text: '"很抱歉，服务器出现错误，请稍后再试1~"',
								onOK: function () {
								// window.location.href="./index.html";
								}
							 })					 
					 })
    	},		
			getProduct:function(){
				var _this=this;
				if(_this.getUrlParam('ym')=='bb-dr-lk-bb.html'){
					lstorage.removeItem("selectedProduct");
				}
				var useData={
					pageIndex:1,
					pageSize:10
				};
				axios({
					method:"post",
					url:"/Project/GetProjectPageList",
					data:JSON.stringify(useData)
				})
					.then(function(r){
						//console.log(r);
						if(r.data.code=='1001'){
							_this.productList=r.data.data.ProjectList.DataList;
							_this.dataTotal=r.data.data.ProjectList.TotalRecord;
							if(_this.dataTotal>10){
								lstorage.setItem("bxcontent",JSON.stringify(_this.productList));
							}
						}else{
							$.toast(r.data.message, "text");
						}
					})
					 .catch(function(error){
							$.alert({
								title: '服务器错误',
								text: '"很抱歉，服务器出现错误，请稍后再试~"',
								onOK: function () {
								// window.location.href="./index.html";
								}
							 })					 
					 })
			},	
			changeCity(id,index,name){
				var _this=this;
				_this.current=index;
				if(name==undefined){
					_this.cityListNameF='不限';
				}else{
					_this.cityListF=id;
					_this.cityListNameF=name;
				}
				//console.log(_this.cityList);
				axios.get("/Region/GetRegionCityOrArea",{
					params:{
						RegionId:id
					}
				})
					.then(function(r){
						// //console.log(r);
						if(r.data.code=='1001'){
							_this.area=r.data.data;
							_this.area.unshift({Name:'不限',ParentId: '-1',RegionId: '-1'});
						}						
					})
					 .catch(function(error){
							$.alert({
								title: '服务器错误',
								text: '"很抱歉，服务器出现错误，请稍后再试1~"',
								onOK: function () {
								// window.location.href="./index.html";
								}
							 })					 
					 })					
			},
			selectA:function(name,index,id){
				var _this=this;	
				_this.isNum=true;
				_this.currentSub=index;					
				_this.tab='';
				if(id!=-1){
					_this.cityList=id;
					_this.cityListName=name;
					_this.sCity=name;
				}else{
					_this.cityList=_this.cityListF;
					_this.cityListName=_this.cityListNameF;	
					_this.sCity=_this.cityListNameF;
				}
				//console.log(_this.cityList);
				_this.statusAction();
			},				
			show:function(name){
				var _this=this;
				if(_this.tab!=''){
					if(name!=lstorage.getItem('cityN')){
						_this.tab=name;
						lstorage.setItem('cityN',name);
					}else{
						_this.tab='';
					}
				}else{
					_this.tab=name;
					lstorage.setItem('cityN',name);				
				}
			},		
							
							
							
		selectPro:function(index,id,name,oName,oId){
			var _this=this;
			_this.tab='';
			var obj={ProjectId:id,pname:name,uname:oName,ReceiveUserId:oId};
			if(_this.getUrlParam('id')==null){
				if(_this.arrSel.indexOf(id)<0){
					_this.arrSel.push(id);
					_this.arrSelList.push(obj);
				}else{
					var n=_this.arrSel.indexOf(id);
					//console.log(n);
					_this.arrSel.splice(n,1);
					_this.arrSelList.splice(n,1);
				}
			}else{
				//console.log(_this.arrSel.indexOf(id));
				if(_this.arrSel.indexOf(id)<0){
					_this.arrSel[0]=id;
					_this.arrSelList[0]=obj;
					_this.arrSel=[_this.arrSel[0]];
					_this.arrSelList=[_this.arrSelList[0]];
					//console.log(_this.arrSel);
					//console.log(_this.arrSelList);
				}else{
					_this.arrSel=[];
					_this.arrSelList=[];
					//console.log(_this.arrSel);
				}				
			}
		},		
// 		priceInfo:function(){
// 			var _this=this;
// 			_this.tab='';
// // 均价
// 			if(_this.price.AttributeValueName=='不限'){
// 				_this.priceList=[];
// 			}else{
// 				_this.priceList=[_this.price];
// 			}
// 			_this.showPriceL={AttributeId:_this.showPriceL.AttributeId,AttributeName:_this.showPriceL.AttributeName,AttributeNameText:_this.showPriceL.AttributeNameText,AttributeType:_this.showPriceL.AttributeType,AttributeValueList:_this.priceList};
// 			_this.filtrateList=[_this.showPriceL];	
// 			_this.statusAction();
// 		},	
		// 价格选择
		selectPrice:function(name,index){
			var _this=this;
			_this.tab='';
			_this.pSub=index;
			_this.priceName=name.AttributeValueName;
			if(_this.priceName=='不限'){
				_this.priceList=[];
			}else{
				_this.priceList=[name];
			}
			_this.showPriceL={AttributeId:_this.showPriceL.AttributeId,AttributeName:_this.showPriceL.AttributeName,AttributeNameText:_this.showPriceL.AttributeNameText,AttributeType:_this.showPriceL.AttributeType,AttributeValueList:_this.priceList};
			_this.filtrateList=[_this.showPriceL];	
			//console.log(_this.filtrateList);
			// 执行条件搜索
			_this.statusAction();			
		},
		
// 每次选择条件后执行条件搜索
		statusAction:function(){
			var _this=this;
			_this.count=1;//还原页数
			_this.arrSel=[];
			_this.arrSelList=[];
			$.showLoading("数据加载中");
			// 公共提交数据格式
			var useData={
				PageIndex: 1,
				PageSize: 10,
				RegionId: _this.cityList,	
				AttributeList:_this.filtrateList
			};
			axios({
				method:"post",
				url:"/Project/GetProjectPageList",
				data:JSON.stringify(useData),
			})
			.then(function(r){
				//console.log(r);
				if(r.data.code=='1001'){
					_this.productList=r.data.data.ProjectList.DataList;
					_this.totalNum=r.data.data.ProjectList.TotalRecord;
					_this.dataTotal=r.data.data.ProjectList.TotalRecord;
					if(_this.dataTotal>10){
						lstorage.setItem("bxcontent",JSON.stringify(_this.productList));
					}
					setTimeout(function(){
						$.hideLoading();
					},500);
				}else{
					$.toast("服务器繁忙", "text");
				}
			})
			 .catch(function(error){
					$.alert({
						title: '服务器错误',
						text: '"很抱歉，服务器出现错误，请稍后再试5~"',
						onOK: function () {
						// window.location.href="./index.html";
						window.location.href="login.html";
						}
					 })					 
			 })				
		},		
		// 查看更多
		readMore:function(){
			var _this=this;
			_this.count++;
			_this.dataTotal=_this.dataTotal-10;
			$.showLoading("数据加载中");
			// 公共提交数据格式
			var useData={
				PageIndex: _this.count,
				PageSize: 10,
			};
			axios({
				method:"post",
				url:"/Project/GetProjectPageList",
				data:JSON.stringify(useData),
			})
			.then(function(r){
				//console.log(r);
				if(r.data.code=='1001'){
					_this.productList = (JSON.parse(lstorage.getItem("bxcontent"))).concat(r.data.data.ProjectList.DataList);//合并两个数组
					lstorage.setItem("bxcontent",JSON.stringify(_this.productList));
					setTimeout(function(){
						$.hideLoading();
					},500);
				}else{
					$.toast("服务器繁忙", "text");
				}
			})
			 .catch(function(error){
					$.alert({
						title: '服务器错误',
						text: '"很抱歉，服务器出现错误，请稍后再试5~"',
						onOK: function () {
						window.location.href="login.html";
						}
					 })					 
			 })							
			
		},	
		// 选择后提交
		selectedProduct:function(){
			var _this=this;
			if(lstorage.getItem("selectedProduct")){
				_this.arrSelList=JSON.parse(lstorage.getItem("selectedProduct")).concat(_this.arrSelList);
				var list=_this.arrSelList;
// 数组对象校验号码是否重复
				var result = [];
				var obj = {};				
				for(var i=0;i<list.length;i++){
				   if(!obj[list[i].ProjectId]){
					  result.push(list[i]);
					  obj[list[i].ProjectId] = true;
				   }
					_this.arrSelList=result;	   
				}
			}
			lstorage.setItem("selectedProduct",JSON.stringify(_this.arrSelList));
			
			if(lstorage.getItem("selectedProduct")=='[]'){
				$.toast("至少选一个盘源","text");
			}else{
				if(_this.getUrlParam('id')!=null){
					window.location.href=_this.getUrlParam('ym')+"?id="+_this.getUrlParam('id')+"&CustomerId="+_this.getUrlParam('CustomerId');
				}else{
					window.location.href=_this.getUrlParam('ym');
				}
			}
		},	
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;	
		},
 },
})