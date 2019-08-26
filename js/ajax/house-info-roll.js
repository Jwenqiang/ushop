document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
			rollMsg:"",
			name:"",
			username:"",
			uCode:"",
			fNum:""
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
// 			if(this.getUrlParam('from')){
// 				window.location.href="http://hfugweb.centaline.com.cn/house_info.html?id="+this.getUrlParam('hid')+"&from=other";
// 			}			
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.username=JSON.parse(storage.getItem("userInfo")).Mobile;
			}			
			axios.get("/Activity/GetCouponById",{
				params:{
					Id:_this.getUrlParam('CouponId')
				}
			})
			.then(function(r){
					//console.log(r);
					if(r.data.code='1001'){
						_this.rollMsg=r.data.data;
					}
				})
		},
		goSave:function(){
			var _this=this;
			if(storage.getItem("userInfo")){
				var userId=JSON.parse(storage.getItem("userInfo")).UserId;
			}else{
				var userId='';
			}
			if(_this.username==""){
				$.toast("手机号不能为空", "text");
			}else if(!(/^1[345678]\d{9}$/.test(_this.username))) {
				$.toast("号码输入有误", "cancel");
			}else if(_this.name==""){
				$.toast("名字不能为空", "text");
			}
			else{			
				var useDada={
					FullName:_this.name,
					ProjectId:_this.getUrlParam('ProjectId'),
					CouponId:_this.getUrlParam('CouponId'),
					UserId:userId,
				  Mobile: _this.username,
				  VerificationCode: _this.uCode,			
				};
				
				axios({
					method:"post",
					url:"/Activity/AddCouponEnroll",
					data:JSON.stringify(useDada)
				})
				 .then(function(r){
					 //console.log(r);
					 //获取本地存储的用户信息
					 if(r.data.code=='1001'){
						 $.alert({
						 	title: '恭喜您领取成功！',
						 	text: '"顾问会及时联系您，为您提供详细的优惠信息，请保持电话通畅~"',
						 	onOK: function () {
						 		//点击确认
						 		window.location.href="house_info.html?id="+_this.getUrlParam('ProjectId');
						 	}	,
						})
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
			if(!(/^1[345678]\d{9}$/.test(_this.username))) {
				// $.toast("号码输入有误", "cancel");
			}else{			
				var useCode={
					Mobile: _this.username,
					type:4       //数字的含义：1 用户注册 2 修改密码 3 申请合作
				};
				axios({
					method:"post",
					url:"/Users/AddUserVerificationCode",
					data:JSON.stringify(useCode)
				})
				.then(function(r){
					//console.log(r);
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