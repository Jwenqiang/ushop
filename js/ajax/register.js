document.write("<script language=javascript src='./js/main.js'></script>");

var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		isNeed:false,
		userInfo:{
			username:"",
			uCode:"",
			password:"",
			fNum:"",
			gnum:"",
			gsName:""
		}
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
		if(this.getUrlParam("membertype")){
			this.isNeed=true
		}			
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
			_this.gnum=_this.guid();
			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			if(_this.getUrlParam("code")!=null&&_this.getUrlParam("state")!=null){
				return false;
            }
            else {
				if (isWeixin) {
					axios.get("/Wx/OAuth",{
						params:{
							JumpHtml:"register.html",
							// Guid: _this.gnum,
							InvitationUserId:_this.getUrlParam("InvitationUserId"),
							InvitationCompanyId:_this.getUrlParam("InvitationCompanyId"),
							InvitationChannelId:_this.getUrlParam("InvitationChannelId"),
						}
					})
						.then(function(r){
							console.log(r);
							if(_this.getUrlParam("membertype")==2){
								window.location.href=r.data+'&membertype=2';
								_this.isNeed=true
							}else{
								window.location.href=r.data;
								_this.isNeed=false
							}
							
						})
						.catch(function(e){
							//console.log('授权失败');
						})
					
				}
			}

		},
		goReg:function(){
			var _this=this;
			if(_this.userInfo.username==""){
				$.toast("手机号不能为空", "text");
			}else if(!(/^1[345678]\d{9}$/.test(_this.userInfo.username))) {
				$.toast("号码输入有误", "cancel");
			}else if(_this.userInfo.uCode=="") {
				$.toast("请填写验证码", "cancel");
			}else if(_this.userInfo.password==""){
				$.toast("密码不能为空", "text");
			}else if(_this.isNeed==true){
				if(!(/^1[345678]\d{9}$/.test(_this.userInfo.fNum))){
					$.toast("请填写推荐人号码", "text");
				}else if(_this.userInfo.gsName==""){
					$.toast("请填写推荐企业", "text");
				}
			}
			else if(_this.userInfo.password.length>18||_this.userInfo.password.length<6){
				$.toast("密码建议6-18位", "cancel");
			}
			else{
			var storage=window.localStorage;		
				if(_this.getUrlParam("code")!=null&&_this.getUrlParam("state")!=null){
					var useDada={
					  Mobile: _this.userInfo.username,
					  RecommendMobile: _this.userInfo.fNum,
					InvitationUserId:_this.getUrlParam("InvitationUserId"),
					InvitationCompanyId:_this.getUrlParam("InvitationCompanyId"),
					InvitationChannelId:_this.getUrlParam("InvitationChannelId"),
					  VerificationCode: _this.userInfo.uCode,
					  Password: _this.userInfo.password,
					  // Guid: _this.gnum,
					  WeiXinCode: _this.getUrlParam("code"),
					  WeiXinState: _this.getUrlParam("state"),
					  RecommendCompany:_this.userInfo.gsName
					};					
				}else{
					var useDada={
					  Mobile: _this.userInfo.username,
					  RecommendMobile: _this.userInfo.fNum,
					InvitationUserId:_this.getUrlParam("InvitationUserId"),
					InvitationCompanyId:_this.getUrlParam("InvitationCompanyId"),
					InvitationChannelId:_this.getUrlParam("InvitationChannelId"),
					  VerificationCode: _this.userInfo.uCode,
					  Password: _this.userInfo.password,
					  RecommendCompany:_this.userInfo.gsName
					// Guid: _this.gnum,			  
					};
				}
				axios({
					method:"post",
					url:"/Users/Register",
					data:JSON.stringify(useDada)
				})
				 .then(function(r){
					 //console.log(r);
					 //获取本地存储的用户信息
					 if(r.data.code=='1001'){
						 //console.log(r.data.data);
						 storage.setItem("userInfo",JSON.stringify(r.data.data));						 
						 $.toast("注册成功", "success");
						// setTimeout(function(){
						// 	 window.location.href="./index.html";
						//  },500)						 
					 }else{
						 $.toast(r.data.message, "cancel");
					 }
				 })
				 .catch(function(error){
					 //console.log(error);
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							}
						 })					 
				 })	
		 }
		},

		// 获取验证码
		sendCode:function(){
			var _this=this;
			if(!(/^1[345678]\d{9}$/.test(_this.userInfo.username))) {
				$.toast("号码输入有误", "cancel");
			}else{			
				var useCode={
					Mobile: _this.userInfo.username,
					type:1       //数字的含义：1 用户注册 2 修改密码 3 申请合作
				};
				axios({
					method:"post",
					url:"/Users/AddUserVerificationCode",
					data:JSON.stringify(useCode)
				})
				.then(function(r){
					_this.uCode=r.data.data.VerificationCode;//验证码值
					//console.log(r);
					//console.log(_this.uCode);
				})
				 .catch(function(error){
					 //console.log(error);
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
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},	
		guid:function() {
		    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
		}			
	}
})