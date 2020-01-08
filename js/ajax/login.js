document.write("<script language=javascript src='./js/main.js'></script>");
// 验证令牌
// axios.defaults.headers.common['Authorization'] = "AUTH_TOKEN";
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		userInfo:{
			username:"",
			password:""
		},
		isNeed:false
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作
		var _this=this;
		if(_this.getUrlParam("MemberType")){
			_this.isNeed=true
		}
	},
	updated:function(){
		// wxShared();	
	},	
	methods:{
		getData:function(a){

		},
		goLogin:function(){
			var _this=this;
			var storage=window.localStorage;
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
				$.showLoading("正在登录中");
				var useDada={
					Mobile: _this.userInfo.username,
					Password: _this.userInfo.password					
				};
				axios({
					method:"post",
					url:"/Users/UserLogin",
					data:JSON.stringify(useDada),

				})
				 .then(function(r){
					 //console.log(r.data.code);
					 //console.log(r.data);
					 storage.clear();
					 Sstorage.clear();
					 //获取本地存储的用户信息
					 if(r.data.code=='1001'){
						 // 全局缓存用户信息
						 storage.setItem("userInfo",JSON.stringify(r.data.data));
						 //console.log(r);
						 setTimeout(function(){
						 	$.hideLoading();
							 $.toast("登陆成功", "success");
						 },500);
						 if(_this.getUrlParam("pre")!=null){
							 setTimeout(function(){
								 window.location.href=_this.getUrlParam("pre");
							 },500)
						 }else{
							 setTimeout(function(){
								 window.location.href="./index.html";
							 },500)
						 }
					 }else{
						 setTimeout(function(){
						 	$.hideLoading();
							$.toast(r.data.message, "cancel");
						 },500);						 
					 }
				 })
				 .catch(function(error){
					 //console.log(error);
					 if(error){
							$.alert({
								title: '服务器错误',
								text: '"很抱歉，服务器出现错误，请稍后再试~"',
								onOK: function () {
								// window.location.href="./index.html";
								}
							 })		
						}				
				 })		
			}
		},
		goReg:function(){
			
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