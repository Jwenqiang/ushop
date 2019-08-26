document.write("<script language=javascript src='./js/wx.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
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
		role:"",
		activeList:"",
		dataTotal:11,
		count:1,
		bmActive:0,
		bmMsg:0,
		bmHouse:0,
		isOn:1
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
	if(storage.getItem("userInfo")){
		this.role=JSON.parse(storage.getItem("userInfo")).RoleType; 
	}	
		this.getNum();
		this.getData(1);
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	updated:function(){
		// wxShared();	
	},	
	methods:{
		getNum:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				axios.get("/Activity/GetActivityEnrollSummaryCount",{
					params:{
						UserId: _this.UserId
					}
				})
				 .then(function(r){
					 console.log(r);
					 if(r.data.code=='1001'){
						_this.bmActive=r.data.data.Activity;
						_this.bmMsg=r.data.data.Information;
						_this.bmHouse=r.data.data.Project;				
					 }else{
						 $.toast(r.data.message, "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误1',
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
		selectN(n){
			this.isOn=n;
			this.getData(n);
		},	
		getData:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				axios.get("/Activity/GetActivityEnrollPageList",{
					params:{
						UserId: _this.UserId,
						EnrollType:a
					}
				})
				 .then(function(r){
					 console.log(r);
					 if(r.data.code=='1001'){
						 _this.activeList=r.data.data.DataList;
						 lstorage.setItem("aacontent",JSON.stringify(_this.activeList));
					 }else{
						 $.toast(r.data.message, "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误2',
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
		cancelApply:function(Id,ActivityId,who){
			var _this=this;
			if(storage.getItem("userInfo")){
				var useData={
					UserId:JSON.parse(storage.getItem("userInfo")).UserId,
					Id:Id,
					ActivityId:ActivityId,
					EnrollType:_this.isOn
				};
				$.confirm({
					title: '取消该活动报名',
					text: '是否取消所选活动的报名？',
					onOK: function () {
					//点击确认
						axios({
							method:"post",
							url:"/Activity/UpdateActivityEnrollState",
							data:JSON.stringify(useData),
						})
						 .then(function(r){
							 console.log(r);
							 if(r.data.code=='1001'){
								 $.toast("报名已取消", "success");
								 _this.getData(_this.isOn);
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
					}
				})					 
			 }else{
				 window.location.href="./login.html";
			 }			
			
		},

readMore:function(){
	var _this=this;
	_this.count++;
	if(storage.getItem("userInfo")){
		_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
		axios.get("/Activity/GetActivityEnrollPageList",{
			params:{
				UserId: _this.UserId,
				PageIndex:_this.count
			}
		})
		 .then(function(r){
			 //console.log(r);
			 if(r.data.code=='1001'){
				 _this.dataTotal=r.data.data.TotalRecord;
				 _this.activeList = (JSON.parse(lstorage.getItem("aacontent"))).concat(r.data.data.DataList);//合并两个数组
				 lstorage.setItem("aacontent",JSON.stringify(_this.activeList));
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
	 }else{
		 window.location.href="./login.html";
	 }	
},
		
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
	}
})