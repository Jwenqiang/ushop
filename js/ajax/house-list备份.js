document.write("<script language=javascript src='./js/wx.js'></script>");
var lstorage=window.sessionStorage;
  var app = new Vue({         // 创建Vue对象。Vue的核心对象。
    el: '.whole',               // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
    data: {                   // data: 是Vue对象中绑定的数据
				city:"",
				area:"",
				tab:'',
				count:1,
				alldata:"",
				dataTotal:"",
				current:0,
				currentSub:0,
				csSub:0,
				jgSub:0,
				hxSub:0,
				pxSub:0,
				isNum:false,
				totalNum:-1,
				mjSub:[],
				cxSub:[],
				lxSub:[],
				zxSub:[],
				sjSub:[],
				sort:[{name:'默认排序',value:'',OrderBy:''},{name:'均价从高到低',value:'aprice',OrderBy:'desc'},{name:'均价从低到高',value:'aprice',OrderBy:'asc'},{name:'评分从高到低',value:'projectscore',OrderBy:'desc'},{name:'开盘时间顺序',value:'dateopen',OrderBy:'asc'},{name:'开盘时间倒序',value:'dateopen',OrderBy:'desc'}],
				showPrice:"",
				showPriceL:{},
				Apartment:"",//户型
				ApartmentL:"",//户型
				Measure:"",//面积
				MeasureL:{},//面积
				Orientation:"",//朝向
				OrientationL:{},//朝向
				Property:"",//物业类型
				PropertyL:{},//物业类型
				Decoration:"",//装修
				DecorationL:{},//装修
				OpenDate:"",//开盘时间
				OpenDateL:{},//开盘时间
				// 条件的展示
				allStatus:[],
				// 缓存
				cityName:"",
				status:[],
				productList:[],//房源列表
				ProjectLikeList:[],//猜你喜欢列表
				// 条件搜索
				searchList:"",
				filtrateList:[],//价格、户型、筛选集合
				searchList:"",//搜索列表
				cityListF:"",//城市列表
				cityList:"",//城市列表
				cityListNameF:"",//城市列表名
				cityListName:"",//城市列表名
				priceList:[],//价格列表
				houseList:[],//户型列表
				orderList:{name:"",OrderBy:""},//排序列表
				jg:"",
				hx:"",
				sx:[],
				showList:false,
				yclick:false,
				isShare:false
    },
    beforeCreate:function(){//创建实例el前
    	
    },    
    created:function(){//创建实例el后
    	this.getData();
    	this.getAttribute();
		if(this.getUrlParam('ym')==null){
			this.getProduct();
		}
		if(this.getUrlParam('from')){
			this.isShare=true;
		}	
 // 微信分享数据
		Sstorage.setItem("urlf",window.location.href);				
    },
    beforeMount:function(){//下面表示已执行方法  虚拟dom还没有内容
		// 其他页面搜索过来的条件
		this.otherSerach();    	
    },    
    mounted:function(){//下面表示已执行方法  编译好html后在这操作
		$("#loadingDiv1").fadeOut(300);			
    },
	updated:function(){	
		var href = window.location.href;
		href = href.substring(href.lastIndexOf("/") + 1);
		if (Sstorage.getItem(href)) {
			$(".whole").scrollTop(Number(Sstorage.getItem(href)));
		}
		// wxShared();	
	},	
    methods:{
			getProduct:function(){
			 // 微信分享数据
			Sstorage.setItem("urlf",window.location.href);
			Sstorage.setItem("bt","好房U购精选新房");
			Sstorage.setItem("tp","http://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg");
			Sstorage.setItem("ms","海量精选房源，品牌开发商，超大优惠力度，全流程贵宾式服务，购房也能省好多钱！");					
				
				
				var _this=this;
			if(_this.allStatus.length==0&&lstorage.getItem("tj")){
				_this.allStatus=JSON.parse(lstorage.getItem("tj"));
				_this.totalNum=lstorage.getItem("cTotal");
				if(_this.allStatus[0].AttributeValueList!=""){
					_this.jg=_this.allStatus[0].AttributeValueList[0].AttributeValueName;
				}else{
					_this.jg='';
				}
				if(_this.allStatus[1].AttributeValueList!=""){
					_this.hx=_this.allStatus[1].AttributeValueList[0].AttributeValueName;
				}else{
					_this.hx='';
				}
				// 筛选的条件显示
				for(var i=2;i<_this.allStatus.length;i++){
					if(_this.allStatus[i].AttributeValueList!=""){
						for(var j=0;j<_this.allStatus[i].AttributeValueList.length;j++){
							_this.sx.push(_this.allStatus[i].AttributeValueList[j].AttributeValueName);
						}
					}
				}				
			}
			if(lstorage.getItem('searchList')){
				_this.searchList=lstorage.getItem('searchList');
			}
			if(lstorage.getItem("cityListName")){
				_this.cityListName=lstorage.getItem("cityListName");
			}
			if(lstorage.getItem("hlcontent")){//如果加载了数据就不调接口
				_this.productList=JSON.parse(lstorage.getItem("hlcontent"));
				_this.dataTotal=lstorage.getItem("cTotal");
				_this.alldata=lstorage.getItem("cTotal");
				if(_this.productList.length<1){
					_this.ProjectLikeList=JSON.parse(lstorage.getItem("like"));
				}				
			}else{
				
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
						if(r.data.code=='1001'){
							_this.productList=r.data.data.ProjectList.DataList;
							_this.alldata=r.data.data.ProjectList.TotalRecord;
							_this.dataTotal=r.data.data.ProjectList.TotalRecord;
							if(_this.dataTotal>10){
								lstorage.setItem("hlcontent",JSON.stringify(_this.productList));
								lstorage.setItem("cTotal",_this.dataTotal);
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
				}	
			},
    	getData:function(){
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
		//获取除城市外的其它属性
		getAttribute:function(){
			var _this=this;
					//获取其它属性
				axios.get("/Attribute/GetAttributeList")
					.then(function(r){
						//console.log(r);
						if(r.data.code=='1001'){
							_this.showPrice=r.data.data.Average.AttributeValueList;
							_this.showPrice.unshift({AttributeValueName:'不限'});
							_this.Apartment=r.data.data.Apartment.AttributeValueList;
							_this.Apartment.unshift({AttributeValueName:'不限'});
							// 更多(价格、户型、筛选)数据
							// 均价数据
							_this.showPriceL=r.data.data.Average;
							// 户型数据
							_this.ApartmentL=r.data.data.Apartment;
							// 筛选数据
							_this.Measure=r.data.data.Measure.AttributeValueList;
							_this.MeasureL=r.data.data.Measure;
							_this.Orientation=r.data.data.Orientation.AttributeValueList;
							_this.OrientationL=r.data.data.Orientation;
							_this.Property=r.data.data.Property.AttributeValueList;
							_this.PropertyL=r.data.data.Property;
							_this.Decoration=r.data.data.Decoration.AttributeValueList;
							_this.DecorationL=r.data.data.Decoration;
							_this.OpenDate=r.data.data.OpenDate.AttributeValueList;
							_this.OpenDateL=r.data.data.OpenDate;
							//数据整理 (可取消注释)
// 							_this.doData(_this.showPrice);
// 							_this.doData(_this.Apartment);
// 								
// 							_this.doData(_this.Measure);
// 							_this.doData(_this.Orientation);
// 							_this.doData(_this.Property);
// 							_this.doData(_this.Decoration);
// 							_this.doData(_this.OpenDate);						
							// 提交数据整理
							// 均价和户型
							_this.showPriceL={AttributeId:_this.showPriceL.AttributeId,AttributeName:_this.showPriceL.AttributeName,AttributeNameText:_this.showPriceL.AttributeNameText,AttributeType:_this.showPriceL.AttributeType,AttributeValueList:_this.priceList};
							_this.ApartmentL={AttributeId:_this.ApartmentL.AttributeId,AttributeName:_this.ApartmentL.AttributeName,AttributeNameText:_this.ApartmentL.AttributeNameText,AttributeType:_this.ApartmentL.AttributeType,AttributeValueList:_this.houseList};

							// 筛选
							_this.MeasureL={AttributeId:_this.MeasureL.AttributeId,AttributeName:_this.MeasureL.AttributeName,AttributeNameText:_this.MeasureL.AttributeNameText,AttributeType:_this.MeasureL.AttributeType,AttributeValueList:_this.mjSub};
							_this.OrientationL={AttributeId:_this.OrientationL.AttributeId,AttributeName:_this.OrientationL.AttributeName,AttributeNameText:_this.OrientationL.AttributeNameText,AttributeType:_this.OrientationL.AttributeType,AttributeValueList:_this.cxSub};
							_this.PropertyL={AttributeId:_this.PropertyL.AttributeId,AttributeName:_this.PropertyL.AttributeName,AttributeNameText:_this.PropertyL.AttributeNameText,AttributeType:_this.PropertyL.AttributeType,AttributeValueList:_this.lxSub};
							_this.DecorationL={AttributeId:_this.DecorationL.AttributeId,AttributeName:_this.DecorationL.AttributeName,AttributeNameText:_this.DecorationL.AttributeNameText,AttributeType:_this.DecorationL.AttributeType,AttributeValueList:_this.zxSub};
							_this.OpenDateL={AttributeId:_this.OpenDateL.AttributeId,AttributeName:_this.OpenDateL.AttributeName,AttributeNameText:_this.OpenDateL.AttributeNameText,AttributeType:_this.OpenDateL.AttributeType,AttributeValueList:_this.sjSub};
							// 整合所有除城市以外的所有属性
							_this.filtrateList=[_this.showPriceL,_this.ApartmentL,_this.MeasureL,_this.OrientationL,_this.PropertyL,_this.DecorationL,_this.OpenDateL];
							
							
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
				_this.cityListF=id;
				_this.cityListNameF=name;
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
			show:function(name){
				var _this=this;
				if(_this.tab!=''){
					if(name!=lstorage.getItem('cityName')){
						_this.tab=name;
						lstorage.setItem('cityName',name);
					}else{
						_this.tab='';
					}
				}else{
					_this.tab=name;
					lstorage.setItem('cityName',name);	
				}
			},
			// 搜索查询
			search:function(a){
				var _this=this;
				lstorage.setItem('searchList',_this.searchList);	
				_this.statusAction();
			},
			// 区域/价格选择后执行  更多选择
			selectA:function(name,index,c,id){
				var _this=this;	
				_this.isNum=true;
				_this.currentSub=index;					
				if(c=='cs'||c=='hx'||c=='jg'||c=='px'){
					_this.tab='';
					if(c=='cs'){
						_this.currentSub=index;
						_this.csSub=index;
						if(id!=-1){
							_this.cityList=id;
							_this.cityListName=name;
						}else{
							_this.cityList=_this.cityListF;
							_this.cityListName=_this.cityListNameF;						
						}
						if(_this.cityListName==undefined){
							_this.cityListName='不限'
						}
						lstorage.setItem('cityListName',_this.cityListName);
						_this.statusAction();
					}
					if(c=='jg'){
						_this.jgSub=index;
						_this.doHover(_this.showPrice,_this.priceList,name,index);
						_this.showPriceL={AttributeId:_this.showPriceL.AttributeId,AttributeName:_this.showPriceL.AttributeName,AttributeNameText:_this.showPriceL.AttributeNameText,AttributeType:_this.showPriceL.AttributeType,AttributeValueList:_this.priceList};
						_this.filtrateList=[_this.showPriceL,_this.ApartmentL,_this.MeasureL,_this.OrientationL,_this.PropertyL,_this.DecorationL,_this.OpenDateL];
						// 执行条件搜索
						_this.statusAction();
					}
					if(c=='hx'){
						_this.hxSub=index;
						_this.doHover(_this.Apartment,_this.houseList,name,index);
						_this.ApartmentL={AttributeId:_this.ApartmentL.AttributeId,AttributeName:_this.ApartmentL.AttributeName,AttributeNameText:_this.ApartmentL.AttributeNameText,AttributeType:_this.ApartmentL.AttributeType,AttributeValueList:_this.houseList};
						_this.filtrateList=[_this.showPriceL,_this.ApartmentL,_this.MeasureL,_this.OrientationL,_this.PropertyL,_this.DecorationL,_this.OpenDateL];
						// 执行条件搜索
						_this.statusAction();
					}												
					if(c=='px'){
						_this.pxSub=index;
						_this.orderList.value=name;
						_this.orderList.OrderBy=id;
						// 执行条件搜索
						_this.statusAction();
					}					
				}else{
					
					// 筛选的所有项
					if(c=='mj'){
// 						_this.Measure[index].active=!_this.Measure[index].active;
// 						var newArr=[];
// 						_this.Measure.forEach(function(val){
// 								if(val.active) newArr.push(val);
// 						});					
// 						_this.mjSub=newArr;//面积取到的数组
						if(_this.Measure[index].Active==true){
							console.log(1);
							_this.Measure[index].Active=false;
						}
						else if(_this.Measure[index].Active==false){
							_this.Measure[index].Active=true;
							console.log(0);
						}
						var newArr=[];
						_this.Measure.forEach(function(val){
								if(val.active) newArr.push(val);
						});					
						_this.mjSub=newArr;//面积取到的数组						
						
					}			
					else if(c=='cx'){
						_this.Orientation[index].active=!_this.Orientation[index].active;
						var newArr=[];
						_this.Orientation.forEach(function(val){
								if(val.active) newArr.push(val);
						});					
						_this.cxSub=newArr;//朝向取到的数组
											
					}
					else if(c=='lx'){
						_this.Property[index].active=!_this.Property[index].active;
						var newArr=[];
						_this.Property.forEach(function(val){
								if(val.active) newArr.push(val);
						});					
						_this.lxSub=newArr;//类型取到的数组
						//console.log(_this.lxSub);						
					}
					else if(c=='zx'){
						_this.Decoration[index].active=!_this.Decoration[index].active;
						var newArr=[];
						_this.Decoration.forEach(function(val){
								if(val.active) newArr.push(val);
						});					
						_this.zxSub=newArr;//装修取到的数组
						//console.log(_this.zxSub);						
					}												
					else if(c=='sj'){
						_this.OpenDate[index].active=!_this.OpenDate[index].active;
						var newArr=[];
						_this.OpenDate.forEach(function(val){
								if(val.active) newArr.push(val);
						});					
						_this.sjSub=newArr;//时间取到的数组
						//console.log(_this.sjSub);						
					}
				}
			},	
			doData:function(d){
				// 面积数据整理
				var data=d;
				var arr=[];
				data.forEach(function(val){
						var j={};
						j.AttributeValueId=val['AttributeValueId'];
						j.AttributeValueName=val['AttributeValueName'];
						j.AttributeValueText=val['AttributeValueText'];
						j.active=false;
						arr.push(j);
				});
				d=arr;
			},	
			// 均价、户型选中效果
			doHover:function(n,nl,name,index){
				var _this=this;
				if(name=='不限'){
					// n[index].active=!n[index].active;
					if(nl==_this.priceList){
						_this.priceList=[];
					}
					if(nl==_this.houseList){
						_this.houseList=[];
					}					
				}else{
					// n[index].active=!n[index].active;
					var newArr=[];
					newArr[0]=n[index]
// 					n.forEach(function(val){
// 							if(val.active) newArr=[val];
// 					});
					//console.log(newArr);
					if(nl==_this.priceList){
						_this.priceList=[];
						_this.priceList=newArr;
					}
					if(nl==_this.houseList){
						_this.houseList=[];
						_this.houseList=newArr;
					}
				}
				// nl=newArr;//价格取到的数组	
				
			},
			// 筛选提交
			filtrate:function(){
			    var _this=this;
				// 整理数据其他属性
				// 均价和户型
				_this.showPriceL={AttributeId:_this.showPriceL.AttributeId,AttributeName:_this.showPriceL.AttributeName,AttributeNameText:_this.showPriceL.AttributeNameText,AttributeType:_this.showPriceL.AttributeType,AttributeValueList:_this.priceList};
				_this.ApartmentL={AttributeId:_this.ApartmentL.AttributeId,AttributeName:_this.ApartmentL.AttributeName,AttributeNameText:_this.ApartmentL.AttributeNameText,AttributeType:_this.ApartmentL.AttributeType,AttributeValueList:_this.houseList};

				// 筛选							
				_this.MeasureL={AttributeId:_this.MeasureL.AttributeId,AttributeName:_this.MeasureL.AttributeName,AttributeNameText:_this.MeasureL.AttributeNameText,AttributeType:_this.MeasureL.AttributeType,AttributeValueList:_this.mjSub};
				_this.OrientationL={AttributeId:_this.OrientationL.AttributeId,AttributeName:_this.OrientationL.AttributeName,AttributeNameText:_this.OrientationL.AttributeNameText,AttributeType:_this.OrientationL.AttributeType,AttributeValueList:_this.cxSub};
				_this.PropertyL={AttributeId:_this.PropertyL.AttributeId,AttributeName:_this.PropertyL.AttributeName,AttributeNameText:_this.PropertyL.AttributeNameText,AttributeType:_this.PropertyL.AttributeType,AttributeValueList:_this.lxSub};
				_this.DecorationL={AttributeId:_this.DecorationL.AttributeId,AttributeName:_this.DecorationL.AttributeName,AttributeNameText:_this.DecorationL.AttributeNameText,AttributeType:_this.DecorationL.AttributeType,AttributeValueList:_this.zxSub};
				_this.OpenDateL={AttributeId:_this.OpenDateL.AttributeId,AttributeName:_this.OpenDateL.AttributeName,AttributeNameText:_this.OpenDateL.AttributeNameText,AttributeType:_this.OpenDateL.AttributeType,AttributeValueList:_this.sjSub};
				_this.filtrateList=[_this.showPriceL,_this.ApartmentL,_this.MeasureL,_this.OrientationL,_this.PropertyL,_this.DecorationL,_this.OpenDateL];			
				
				// 执行条件搜索
				_this.statusAction();
				_this.tab='';
				_this.yclick=true;
			},
			// 筛选项重置条件
			reset:function(){
				var _this=this;
				_this.getAttribute();
				_this.mjSub=[];
				_this.cxSub=[];
				_this.lxSub=[];
				_this.zxSub=[];
				_this.sjSub=[];
			},
// 每次选择条件后执行条件搜索
		statusAction:function(){
			var _this=this;
			_this.showList=true;
			_this.count=1;//还原页数
			$.showLoading("数据加载中");
			$(".whole").scrollTop(0);
			// 公共提交数据格式
			var useData={
				PageIndex: 1,
				PageSize: 10,
				Order: _this.orderList.value,
				OrderBy: _this.orderList.OrderBy,
				RegionId: _this.cityList,	
				RegionName: _this.cityListName,	
				ProjectNameLike: _this.searchList,	
				AttributeList:_this.filtrateList
			};
			
			axios({
				method:"post",
				url:"/Project/GetProjectPageList",
				data:JSON.stringify(useData),
			})
			.then(function(r){
				console.log(r);
				if(r.data.code=='1001'){
					_this.productList=r.data.data.ProjectList.DataList;
					_this.totalNum=r.data.data.ProjectList.TotalRecord;
					_this.dataTotal=r.data.data.ProjectList.TotalRecord;
					lstorage.setItem("cTotal",_this.dataTotal);
					// if(_this.dataTotal>10){
						lstorage.setItem("hlcontent",JSON.stringify(_this.productList));
					// }
					// 猜你喜欢
					if(_this.productList.length==0){
						_this.ProjectLikeList=r.data.data.ProjectLikeList.DataList;
						lstorage.setItem("like",JSON.stringify(_this.ProjectLikeList));
					}
					setTimeout(function(){
						$.hideLoading();
					},500);
					// 储存选中的条件
					
						//存储到本地缓存 
					if(_this.allStatus.length==0&&lstorage.getItem("tj")){
						_this.allStatus=JSON.parse(lstorage.getItem("tj"));
					}else{
						_this.allStatus=_this.filtrateList;		
						lstorage.setItem("tj",JSON.stringify(_this.allStatus));
					}
					
					if(_this.allStatus[0].AttributeValueList!=""){
						_this.jg=_this.allStatus[0].AttributeValueList[0].AttributeValueName;
					}else{
						_this.jg='';
					}
					if(_this.allStatus[1].AttributeValueList!=""){
						_this.hx=_this.allStatus[1].AttributeValueList[0].AttributeValueName;
					}else{
						_this.hx='';
					}
					// 重新选清空筛选条件的数据
					_this.sx=[];
					for(var i=2;i<_this.allStatus.length;i++){
						if(_this.allStatus[i].AttributeValueList!=""){
							for(var j=0;j<_this.allStatus[i].AttributeValueList.length;j++){
								_this.sx.push(_this.allStatus[i].AttributeValueList[j].AttributeValueName);
							}
						}
					}
				}else{
					$.toast("服务器繁忙", "text");
				}
			})
			 .catch(function(error){
					$.alert({
						title: '服务器错误',
						text: '"很抱歉，服务器出现错误，请稍后再试~"',
						onOK: function () {
						// window.location.href="./index.html";
						location.reload();
						}
					 })					 
			 })				
		},
		// 提交去重
		unique:function(arr){
		  var hash=[];
		  for (var i = 0; i < arr.length; i++) {
			 if(hash.indexOf(arr[i])==-1){
			  hash.push(arr[i]);
			 }
		  }
		  return hash;
		},
		// 清空条件
		refresh:function(){
			lstorage.clear();
			location.reload();			
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
				Order: _this.orderList.name,
				OrderBy: _this.orderList.OrderBy,
				RegionId: _this.cityList,	
				RegionName: _this.cityListName,	
				ProjectNameLike: _this.searchList,	
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
// 					_this.productList=r.data.data.ProjectList.DataList;
// 					_this.totalNum=r.data.data.ProjectList.TotalRecord;
					_this.productList = (JSON.parse(lstorage.getItem("hlcontent"))).concat(r.data.data.ProjectList.DataList);//合并两个数组
					lstorage.setItem("hlcontent",JSON.stringify(_this.productList));
					// 猜你喜欢
					if(_this.productList.length==0){
						_this.ProjectLikeList=r.data.data.ProjectLikeList.DataList
					}
					setTimeout(function(){
						$.hideLoading();
					},500);
					// 储存选中的条件(注释)
// 					var list=_this.filtrateList;
// 					for(var i=0;i<list.length;i++){
// 						if(list[i].AttributeValueList.length>0){
// 							for(var j=0;j<list[i].AttributeValueList.length;j++){
// 									_this.allStatus.push(list[i].AttributeValueList[j].AttributeValueName);
// 							}
// 						}
// 					}
// 					_this.allStatus=_this.unique(_this.allStatus);
// 					console.log(_this.allStatus);
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
						}
					 })					 
			 })							
			
		},
		apply:function(e){
			var _this=this;
			if(String(e).indexOf(',')>0){
				e=String(e).split(',')[0];
			}else{
				e=String(e).split(';')[0];
			}
			return e;
		},	
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
		otherSerach:function(){
			var _this=this;
			if(_this.getUrlParam('ym')){
				_this.searchList=lstorage.getItem("msg");
				//console.log(_this.searchList);
				_this.statusOther();
			}
		},
// 其他页面搜索进来
		statusOther:function(){
			var _this=this;
			_this.count=1;//还原页数
			$.showLoading("数据加载中");
			// 公共提交数据格式
			var useData={
				PageIndex: 1,
				PageSize: 10,
				ProjectNameLike: _this.searchList,	
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
						lstorage.setItem("hlcontent",JSON.stringify(_this.productList));
					}
					// 猜你喜欢
					if(_this.productList.length==0){
						_this.ProjectLikeList=r.data.data.ProjectLikeList.DataList
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
						text: '"很抱歉，服务器出现错误，请稍后再试~"',
						onOK: function () {
							location.reload();
						}
					 })					 
			 })				
		},			
    }
  });