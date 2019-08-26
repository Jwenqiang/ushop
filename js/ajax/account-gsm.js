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
		userRole:"",
		UserId:"",
		CompanyName:"",
		CompanyId:"",
		ewmList:"",
		ChannelName:"",
		show:false,
		showE:false,
		QRcodeUrl:"",//生成二维码图片链接
		dataTotal:11,
		count:1				
		
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作
	},
	updated:function(){
		// wxShared();	
	},	
	methods:{
		getData:function(a){
			var _this=this;
			_this.show=false;
			if(storage.getItem("userInfo")){
				_this.CompanyName=JSON.parse(storage.getItem("userInfo")).CompanyName;
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				_this.CompanyId=JSON.parse(storage.getItem("userInfo")).CompanyId;
				axios.get("/Users/GetQRcodePageList",{
					params:{
						CompanyId: _this.CompanyId,
						CompanyUserId: _this.UserId						
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						_this.ewmList=r.data.data.DataList;
					 lstorage.setItem("agcontent",JSON.stringify(_this.ewmList));						
					 }else{
						 $.toast(r.data.message, "text");
					 }
				 })
				 .catch(function(error){
					 //console.log(error);
					$.alert({
						title: '服务器错误',
						text: '"很抱歉，服务器出现错误，请稍后再试~"',
						onOK: function () {
						//点击确认
						}
					 })					 
				 })
			}
		},
readMore:function(){
			var _this=this;
			_this.show=false;
			_this.count++;
			if(storage.getItem("userInfo")){
				_this.CompanyName=JSON.parse(storage.getItem("userInfo")).CompanyName;
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				_this.CompanyId=JSON.parse(storage.getItem("userInfo")).CompanyId;
				axios.get("/Users/GetQRcodePageList",{
					params:{
						CompanyId: _this.CompanyId,
						CompanyUserId: _this.UserId,
						PageIndex:_this.count
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						_this.dataTotal=r.data.data.TotalRecord;
						_this.ewmList = (JSON.parse(lstorage.getItem("agcontent"))).concat(r.data.data.DataList);//合并两个数组						
					  lstorage.setItem("agcontent",JSON.stringify(_this.ewmList));						
					 }else{
						 $.toast("服务器繁忙", "text");
					 }
				 })
				 .catch(function(error){
					 //console.log(error);
					$.alert({
						title: '服务器错误',
						text: '"很抱歉，服务器出现错误，请稍后再试~"',
						onOK: function () {
						//点击确认
						}
					 })					 
				 })
			}	
},
		goChannel:function(a){
				var _this=this;
				var useData={
					CompanyId: _this.CompanyId,
					CompanyUserId: _this.UserId	,
					ChannelName: _this.ChannelName,				
				};
				if(storage.getItem("userInfo")){
					_this.CompanyName=JSON.parse(storage.getItem("userInfo")).CompanyName;
					_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
					_this.CompanyId=JSON.parse(storage.getItem("userInfo")).CompanyId;
					axios({
						method:"post",
						url:"/Users/AddQRcode",
						data:JSON.stringify(useData),
					})
					 .then(function(r){
						 //console.log(r);
						 if(r.data.code=='1001'){
							var qdId=r.data.message;
							//console.log(qdId);
							axios.get("/Users/GetQRcodeById",{
								params:{
									CompanyId: _this.CompanyId,
									CompanyUserId: _this.UserId	,
									Id:qdId
								}
							})
								.then(function(e){
									 //console.log(e);
									 if(e.data.code=='1001'){
										_this.showE=!_this.showE;
										_this.QRcodeUrl=e.data.data.QRcodeUrl;										
										_this.ChannelName=e.data.data.ChannelName;
									 }else{
										 $.toast("服务器繁忙", "text");
									 }									
								})
								 .catch(function(error){
									 //console.log(error);
									$.alert({
										title: '服务器错误',
										text: '"很抱歉，服务器出现错误，请稍后再试~"',
										onOK: function () {
										//点击确认
										}
									 })					 
								 })							
							
							
						 }else{
							 $.toast(r.data.message, "text");
						 }
					 })
					 .catch(function(error){
						 //console.log(error);
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							//点击确认
							}
						 })					 
					 })
				}		
		},
	}
})