document.write("<script language=javascript src='./js/main.js'></script>");
var lstorage=window.sessionStorage;
  var app = new Vue({         // 创建Vue对象。Vue的核心对象。
    el: '.whole',               // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
    data: {                   // data: 是Vue对象中绑定的数据
				city:"",
				area:"",
				tab:'',
				count:1,
				dataTotal:"",
				current:0,
				currentSub:-1,
				csSub:-1,
				jgSub:-1,
				hxSub:-1,
				pxSub:-1,
				isNum:false,
				totalNum:0,
				mjSub:[],
				cxSub:[],
				lxSub:[],
				zxSub:[],
				sjSub:[],
				sort:[{name:'默认排序',OrderBy:''},{name:'均价从高到低',OrderBy:'desc'},{name:'均价从低到高',OrderBy:'asc'},{name:'评分从高到低',OrderBy:'desc'},{name:'开盘时间顺序',OrderBy:'asc'},{name:'开盘时间倒序',OrderBy:'desc'}],
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
				sx:[]
    },
    beforeCreate:function(){//创建实例el前
    	
    },    
    created:function(){//创建实例el后
    	this.getData();
    	this.getAttribute();
    	this.getProduct();
    },
    beforeMount:function(){//下面表示已执行方法  虚拟dom还没有内容
    	
    },    
    mounted:function(){//下面表示已执行方法  编译好html后在这操作
				
    },
    methods:{
			getProduct:function(){
				var _this=this;
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
								lstorage.setItem("hlcontent",JSON.stringify(_this.productList));
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
								}
							 })					 
					 })
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
							//数据整理 
							_this.doData(_this.showPrice);
							_this.doData(_this.Apartment);
								
							_this.doData(_this.Measure);
							_this.doData(_this.Orientation);
							_this.doData(_this.Property);
							_this.doData(_this.Decoration);
							_this.doData(_this.OpenDate);						
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
				_this.statusAction();
			},
			// 区域/价格选择后执行  更多选择
			selectA:function(name,index,c,id){
				var _this=this;	
				_this.isNum=true;
				_this.currentSub=index;					
				if(c=='cs'||c=='hx'||c=='jg'||c=='px'){
					_this.tab='';
				}
				if(c=='cs'){
					_this.currentSub=index;
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
					//console.log(_this.cityList);
					//console.log(_this.cityListName);
					_this.statusAction();
				}
				if(c=='jg'){
					_this.jgSub=index;
// 					_this.showPrice[index].active=!_this.showPrice[index].active;
// 					let newArr=[];
// 					_this.showPrice.forEach(function(val){
// 							if(val.active) newArr.push(val);
// 					});					
// 					_this.priceList=newArr;//价格取到的数组
					_this.doHover(_this.showPrice,_this.priceList,name,index);
					_this.showPriceL={AttributeId:_this.showPriceL.AttributeId,AttributeName:_this.showPriceL.AttributeName,AttributeNameText:_this.showPriceL.AttributeNameText,AttributeType:_this.showPriceL.AttributeType,AttributeValueList:_this.priceList};
					_this.filtrateList=[_this.showPriceL,_this.ApartmentL,_this.MeasureL,_this.OrientationL,_this.PropertyL,_this.DecorationL,_this.OpenDateL];
					//console.log(_this.filtrateList);
					// 执行条件搜索
					_this.statusAction();
				}
				if(c=='hx'){
					_this.hxSub=index;
// 					_this.Apartment[index].active=!_this.Apartment[index].active;
// 					let newArr=[];
// 					_this.Apartment.forEach(function(val){
// 							if(val.active) newArr.push(val);
// 					});					
// 					_this.houseList=newArr;//户型取到的数组
					_this.doHover(_this.Apartment,_this.houseList,name,index);
					_this.ApartmentL={AttributeId:_this.ApartmentL.AttributeId,AttributeName:_this.ApartmentL.AttributeName,AttributeNameText:_this.ApartmentL.AttributeNameText,AttributeType:_this.ApartmentL.AttributeType,AttributeValueList:_this.houseList};
					_this.filtrateList=[_this.showPriceL,_this.ApartmentL,_this.MeasureL,_this.OrientationL,_this.PropertyL,_this.DecorationL,_this.OpenDateL];
					// 执行条件搜索
					_this.statusAction();
				}												
				if(c=='px'){
					_this.pxSub=index;
					_this.orderList.name=name;
					_this.orderList.OrderBy=id;
					//console.log(_this.orderList.OrderBy);
					// 执行条件搜索
					_this.statusAction();
				}
				// 筛选的所有项
				if(c=='mj'){
					_this.Measure[index].active=!_this.Measure[index].active;
					let newArr=[];
					_this.Measure.forEach(function(val){
							if(val.active) newArr.push(val);
					});					
					_this.mjSub=newArr;//面积取到的数组
					
				}			
				if(c=='cx'){
					_this.Orientation[index].active=!_this.Orientation[index].active;
					let newArr=[];
					_this.Orientation.forEach(function(val){
							if(val.active) newArr.push(val);
					});					
					_this.cxSub=newArr;//朝向取到的数组
										
				}
				if(c=='lx'){
					_this.Property[index].active=!_this.Property[index].active;
					let newArr=[];
					_this.Property.forEach(function(val){
							if(val.active) newArr.push(val);
					});					
					_this.lxSub=newArr;//类型取到的数组
					//console.log(_this.lxSub);						
				}
				if(c=='zx'){
					_this.Decoration[index].active=!_this.Decoration[index].active;
					let newArr=[];
					_this.Decoration.forEach(function(val){
							if(val.active) newArr.push(val);
					});					
					_this.zxSub=newArr;//装修取到的数组
					//console.log(_this.zxSub);						
				}												
				if(c=='sj'){
					_this.OpenDate[index].active=!_this.OpenDate[index].active;
					let newArr=[];
					_this.OpenDate.forEach(function(val){
							if(val.active) newArr.push(val);
					});					
					_this.sjSub=newArr;//时间取到的数组
					//console.log(_this.sjSub);						
				}		
			},	
			doData:function(d){
				// 面积数据整理
				let data=d;
				let arr=[];
				data.forEach(function(val){
						let j={};
						j.AttributeValueId=val['AttributeValueId'];
						j.AttributeValueName=val['AttributeValueName'];
						j.AttributeValueText=val['AttributeValueText'];
						j.active=false;
						arr.push(j);
				});
				d=arr;
			},	
			// 筛选选中效果
			doHover:function(n,nl,name,index){
				var _this=this;
				if(name=='不限'){
					n[index].active=!n[index].active;
					if(nl==_this.priceList){
						_this.priceList=[];
					}
					if(nl==_this.houseList){
						_this.houseList=[];
					}					
				}else{
					n[index].active=!n[index].active;
					let newArr=[];
					n.forEach(function(val){
							if(val.active) newArr=[val];
					});
					//console.log(newArr);
					if(nl==_this.priceList){
						_this.priceList=[];
						_this.priceList=newArr;
						//console.log(_this.priceList);
					}
					if(nl==_this.houseList){
						_this.houseList=[];
						_this.houseList=newArr;
						//console.log(_this.houseList);
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
			_this.count=1;//还原页数
			$.showLoading("数据加载中");
			// 公共提交数据格式
			var useData={
				PageIndex: 1,
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
					// 储存选中的条件
					_this.allStatus=_this.filtrateList;
					if(_this.allStatus[0].AttributeValueList!=""){
						_this.jg=_this.allStatus[0].AttributeValueList[0].AttributeValueName;
					}
					if(_this.allStatus[1].AttributeValueList!=""){
						_this.hx=_this.allStatus[1].AttributeValueList[0].AttributeValueName;
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
			location.reload()			
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
					lstorage.setItem("aacontent",JSON.stringify(_this.productList));
					// 猜你喜欢
					if(_this.productList.length==0){
						_this.ProjectLikeList=r.data.data.ProjectLikeList.DataList
					}
					setTimeout(function(){
						$.hideLoading();
					},500);
					// 储存选中的条件
					var list=_this.filtrateList;
					for(var i=0;i<list.length;i++){
						if(list[i].AttributeValueList.length>0){
							for(var j=0;j<list[i].AttributeValueList.length;j++){
								_this.allStatus.push(list[i].AttributeValueList[j].AttributeValueName);
							}
						}
					}
					_this.allStatus=_this.unique(_this.allStatus);
					//console.log(_this.allStatus);
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
    }
  });