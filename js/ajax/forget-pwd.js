document.write("<script language=javascript src='./js/main.js'></script>");

var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		userInfo:{
			username:"",
			uCode:"",
			password:"",
		}
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后

	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	methods:{
		getData:function(a){

		},
		goSet:function(){
			var _this=this;
			if(_this.userInfo.username==""){
				$.toast("手机号不能为空", "text");
			}else if(!(/^1[345678]\d{9}$/.test(_this.userInfo.username))) {
				$.toast("号码输入有误", "cancel");
			}else if(_this.userInfo.password==""){
				$.toast("密码不能为空", "text");
			}
			else if(_this.userInfo.password.length>18||_this.userInfo.password.length<6){
				$.toast("密码输入有误", "cancel");
			}
			else{
			var storage=window.localStorage;				
				var useDada={
					type:2,
				  Mobile: _this.userInfo.username,
				  VerificationCode: _this.userInfo.uCode,
				  Password: _this.userInfo.password			
				};
				
				axios({
					method:"post",
					url:"/Users/UpdatePassword",
					data:JSON.stringify(useDada)
				})
				 .then(function(r){
					 //console.log(r);
					 //获取本地存储的用户信息
					 if(r.data.code=='1001'){
						 //console.log(r.data.data);
						 $.toast("密码已重置", "success");
						 if(_this.getUrlParam("pre")!=null){
								setTimeout(function(){
									window.location.href=_this.getUrlParam("pre");
								},500)
						 }else{
							setTimeout(function(){
								 window.location.href="./login.html";
							 },500)
						}
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
							// window.location.href="./index.html";
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
				type:2       //数字的含义：1 用户注册 2 修改密码 3 申请合作
			};
			axios({
				method:"post",
				url:"/Users/AddUserVerificationCode",
				data:JSON.stringify(useCode)
			})
			.then(function(r){
				_this.uCode=r.data.data.VerificationCode;//验证码值
				// console.log(r);
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
	}
})