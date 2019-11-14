document.write("<script language=javascript src='./js/wx.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	// var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		userRole:"",
		userId:"",
		userToken:"",
		CompanyName:"",
		phoneNum:phoneNum,
		showK:false,
		invCount:0,
		nickname:"",
		mobile:"",
		fname:"",
        fimg: "",
        nickname: "",
		regTime:"",
		myurl:"",
		hkCount:0,
		myBg:"",
		yjMoney:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		if(storage.getItem("userInfo")){
			this.userId=JSON.parse(storage.getItem("userInfo")).UserId;
			this.userToken=JSON.parse(storage.getItem("userInfo")).Token;
		}	
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
			if(_this.getUrlParam('x')==1){
				$('#footer').addClass("fixedX");
			}			
			if(storage.getItem("userInfo")){
				_this.userRole=JSON.parse(storage.getItem("userInfo")).RoleType;
				axios.get("/Users/GetUser",{
					params:{
						UserId: _this.userId
					}
				})
				 .then(function(r){
					 console.log(r);
					 if(r.data.code=='1001'){
						 _this.userRole=r.data.data.RoleType;
						 _this.yjMoney=r.data.data.UserAward;
						 _this.myBg=r.data.data.SystemConfigMainImg;
						 _this.CompanyName=r.data.data.CompanyName;
                         _this.fname = r.data.data.FullName;
                         _this.nickname = r.data.data.NickName;
						 _this.fimg=r.data.data.HeadImg;
						 _this.mobile=r.data.data.Mobile;
						 _this.regTime=r.data.data.AddTime;
						 _this.myurl=r.data.data.UserQRCodeUrl;
						 _this.hkCount=r.data.data.EnrollHandleCount;
					 }else{
						 $.toast(r.data.message, "text");
						 setTimeout(function(){
							 window.location.href="login.html";
						 },500)
					 }
				 })
				 .catch(function(error){
					$.toast(error, "text");
					setTimeout(function(){
							storage.clear();
							window.location.href="login.html";	
					})										 
				 })
				 if(_this.userRole=='1'){
					axios.get("/Users/GetInvitationUserReward",{
						params:{
							InvitationUserId:_this.userId
						}
					})
					 .then(function(r){
						 //console.log(r);
						 if(r.data.code=='1001'){
							 _this.invCount=r.data.data.Count;
						 }else{
							 $.toast(r.data.message, "text");
						 }
					 })
					 .catch(function(error){
							$.alert({
								title: '服务器错误',
								text: '"很抱歉，服务器出现错误，请稍后再试~"',
								onOK: function () {
								//点击确认
								window.location.href="./login.html";
								}
							 })					 
					 })
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
	}
})