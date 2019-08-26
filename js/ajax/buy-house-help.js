document.write("<script language=javascript src='./js/main.js'></script>");
var lstorage=window.sessionStorage;
var storage=window.localStorage;
  var app = new Vue({         // 创建Vue对象。Vue的核心对象。
    el: '.whole',               // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
    data: {                   // data: 是Vue对象中绑定的数据
				userName:"",
				userPhone:"",
				city:"",
				area:"",
				current:0,
				currentP:0,
				currentSub:-1,
				mjSub:-1,
				zjSub:-1,
				cxSub:-1,
				lxSub:-1,
				zxSub:-1,
				sjSub:-1,
				showPrice:"",
				Apartment:"",//户型
				Measure:"",//面积
				Orientation:"",//朝向
				Property:"",//物业类型
				Decoration:"",//装修
				cs:"",
				qy:"",
				lx:"",
				mj:"",
				zj:"",
				status:[]
    },
    beforeCreate:function(){//创建实例el前
    	
    },    
    created:function(){//创建实例el后
		this.getData();
		this.getOther();
    },
    beforeMount:function(){//下面表示已执行方法  虚拟dom还没有内容
    	
    },    
    mounted:function(){//下面表示已执行方法  编译好html后在这操作
		
    },
	updated:function(){
		// wxShared();	
	},	
    methods:{
    	getData:function(){
				var _this=this;
				if(storage.getItem("userInfo")){
					_this.userName=JSON.parse(storage.getItem("userInfo")).NickName;
					_this.userPhone=JSON.parse(storage.getItem("userInfo")).Mobile;				
				}
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
							// _this.changeCity(r.data.data[0].RegionId,0,'不限');
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
		getOther:function(){
			var _this=this;
					//获取其它属性
				axios.get("/Attribute/GetAttributeList")
					.then(function(r){
						//console.log(r);
						if(r.data.code=='1001'){
							_this.showPrice=r.data.data.Total.AttributeValueList;
							_this.showPrice.unshift({AttributeValueName:'不限'});
							_this.Apartment=r.data.data.Apartment.AttributeValueList;
							_this.Apartment.unshift({AttributeValueName:'不限'});
							// 更多筛选
							_this.Measure=r.data.data.Measure.AttributeValueList;
							_this.Orientation=r.data.data.Orientation.AttributeValueList;
							_this.Property=r.data.data.Property.AttributeValueList;
							_this.Decoration=r.data.data.Decoration.AttributeValueList;
							_this.OpenDate=r.data.data.OpenDate.AttributeValueList;
							$("#loadingDiv1").fadeOut(300);	
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
			changeCity(id,index,name){
				var _this=this;
				_this.current=index;
				_this.currentSub=-1;
				_this.cs=name.trim();
				axios.get("/Region/GetRegionCityOrArea",{
					params:{
						RegionId:id
					}
				})
					.then(function(r){
						//console.log(r);
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
			// 区域/价格选择后执行
			selectA:function(name,index,c){
				var _this=this;
				name=name.trim();
				if(c=='qy'){
					_this.currentSub=index;
					_this.qy=name;
				}				
				if(c=='mj'){
					_this.mjSub=index;
					_this.mj=name;
				}
				if(c=='zj'){
					_this.zjSub=index;
					_this.zj=name;
				}				
				if(c=='lx'){
					_this.lxSub=index;
					_this.lx=name;
				}		
			},
			goSub:function(){
				var _this =this;
				var all=_this.cs+";"+_this.qy+";"+_this.mj+";"+_this.lx+";"+_this.zj;
				if(_this.userName!=''&&_this.userPhone!=''){
					var useData={
						Type:2,
						FullName: _this.userName,
						Mobile:_this.userPhone,
						Remark:all
					};
					//console.log(_this.status);
					axios({
						method:"post",
						url:"/System/AddApplyCooperation",
						data:JSON.stringify(useData)
					})
					.then(function(r){
						if(r.data.code='1001'){
							$.alert({
								title: '提交成功！',
								text: '您的找房信息已提交成功！如有合适的房源，平台工作人员会联系您。',
								onOK: function () {
									//点击确认
									location.reload();	
								}
							});								
						}else{
							$.toast("请稍后再试","text");
						}
					})
				}else{
					$.toast("必填项不能空着~","text");
				}

			},		
    }
  });