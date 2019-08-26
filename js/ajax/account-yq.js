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
		// userId:"",
		userToken:"",
		invCount:0,
		ymoney:0,
		dmoney:0,
		dataList:[],
		AllType:0,
		dataTotal:11,
		count:1,
		atype:1,
		ewm:"",
		userHref:"",
		showTip:false,
		yqData:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getBj();
		this.getUser();
		// this.getData();
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
			if(storage.getItem("userInfo")){
				axios.get("/Users/GetInvitationUserReward",{
					params:{
						InvitationUserId:userId,
						AllType:1
					}
				})
				 .then(function(r){
					 // console.log(r);
					 _this.allType=1;
					 if(r.data.code=='1001'){
						 _this.invCount=r.data.data.Count;
						 _this.ymoney=r.data.data.YesReward;
						 _this.dmoney=r.data.data.NoReward;
						 _this.dataList=r.data.data.InvitationUserRewardList.DataList;
						 if(_this.dataList==null){
							 _this.dataList=[];
						 }
						 _this.dataTotal=r.data.data.TotalRecord;
						 lstorage.setItem("aycontent",JSON.stringify(_this.dataList));
					 }else{
						 $.toast(r.data.message, "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试1~"',
							onOK: function () {
							//点击确认
							window.location.href="login.html";
							}
						 })					 
				 })
			}
		},
		getBj:function(a){
			var _this=this;
			axios.get("System/GetSystemConfigByKey")
			 .then(function(r){
				 console.log(r);
				 if(r.data.code=='1001'){
					_this.yqData=r.data.data
				 }else{
					 $.toast("服务器繁忙", "text");
				 }
			 })
			 .catch(function(error){
					$.alert({
						title: '服务器错误',
						text: '"很抱歉，服务器出现错误，请稍后再试2~"',
						onOK: function () {
						//点击确认
						window.location.href="login.html";
						}
					 })					 
			 })
		},			
		getUser:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				axios.get("/Users/GetUser",{
					params:{
						UserId:userId,
					}
				})
				 .then(function(r){
					 console.log(r);
					 if(r.data.code=='1001'){
						 _this.ewm=r.data.data.QRcodeUrl;
						 _this.userHref=r.data.data.UserQRCodeUrl;
						 Sstorage.setItem("myshare",r.data.data.UserQRCodeUrl);
					 }else{
						 $.toast("服务器繁忙", "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试2~"',
							onOK: function () {
							//点击确认
							window.location.href="login.html";
							}
						 })					 
				 })
			}
		},		
		
		
yq:function(e){
	var _this=this;
	_this.atype=e;
	 _this.dataList=[];
	axios.get("/Users/GetInvitationUserReward",{
		params:{
			InvitationUserId:userId,
			AllType:_this.atype
		}
	})
	 .then(function(r){
		 console.log(r);
		 if(r.data.code=='1001'){
			 if(r.data.data.InvitationUserRewardList.DataList==null){
				 _this.dataList=[];
			 }else{
				 _this.dataList=r.data.data.InvitationUserRewardList.DataList;
			 }	
			console.log(_this.dataList);		  
			console.log(_this.dataList.length);		  
			_this.dataTotal=r.data.data.TotalRecord;
			lstorage.setItem("aycontent",JSON.stringify(_this.dataList));			 
		 }else{
			 $.toast("服务器繁忙", "text");
		 }
	 })
	 .catch(function(error){
			$.alert({
				title: '服务器错误',
				text: '"很抱歉，服务器出现错误，请稍后再试~"',
				onOK: function () {
				//点击确认
				// window.location.href="./index.html";
				}
			 })					 
	 })	
},
readMore:function(){
			var _this=this;
			_this.count++;
			if(storage.getItem("userInfo")){
				axios.get("/Users/GetInvitationUserReward",{
					params:{
						InvitationUserId:userId,
						AllType:_this.alltype
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						_this.dataTotal=r.data.data.TotalRecord;
						_this.dataList = (JSON.parse(lstorage.getItem("aycontent"))).concat(r.data.data.InvitationUserRewardList.DataList);//合并两个数组
						lstorage.setItem("aycontent",JSON.stringify(_this.dataList));
					 }else{
						 $.toast("服务器繁忙", "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							//点击确认
							window.location.href="./index.html";
							}
						 })					 
				 })
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