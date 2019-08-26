var storage=window.localStorage;
var Sstorage=sessionStorage;

var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		infoId:"",
		product:"",
		msg:{
			name:"",
			phone:"",
			num:""
		},
		SourceUserId:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData()
	
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	updated:function(){
		$("#loadingDiv1").fadeOut(300);	
	},
	methods:{
		getData:function(a){
			if(this.getUrlParam("SourceUserId")){
				this.SourceUserId=this.getUrlParam("SourceUserId")
			}			
			if(storage.getItem("userInfo")){
				// 验证令牌
				axios.defaults.headers.common['token'] =JSON.parse(storage.getItem("userInfo")).Token	
			}			
			var _this=this;
			_this.infoId=_this.getUrlParam("id");
			// 公共提交数据格式
			if(_this.getUrlParam("id")!=null){
				if(storage.getItem("userInfo")){
					_this.msg.phone=JSON.parse(storage.getItem("userInfo")).Mobile
				}
				axios.get("/Project/GetProjectById",{
					params:{
						id:_this.getUrlParam("id"),
						SourceUserId:_this.SourceUserId
					}
				})
				.then(function(r){
					console.log(r);
					if(r.data.code=='1001'){
						_this.product=r.data.data
					}else{

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
				window.location.href="./index.html";
			}
		},
		// 活动报名
		goActive:function(){
			var _this=this;
			if(_this.msg.name==""){
				$.toast("姓名不能为空~", "text");
			}else if(_this.msg.phone==""){
				$.toast("电话不能为空~", "text");
			}else if(!(/^1[345678]\d{9}$/.test(_this.msg.phone))){
				$.toast("电话填写有误~", "text");
			}
			else if(_this.msg.num==""){
				$.toast("人数不能为空~", "text");
			}else{

				var data={
					ActivityId: this.getUrlParam('id'),
					FullName: _this.msg.name,
					Mobile: _this.msg.phone,
					Number: _this.msg.num,
					EnrollType:3,
					SourceUserId:_this.SourceUserId
				};				

				axios({
				  method: 'post',
				  url: 'Activity/AddActivityEnroll',
				  data:  JSON.stringify(data),
				})
					.then(function(r){
						//console.log(r);
						if(r.data.code=="1001"){
							_this.isF=false;
							$.alert({
							  title: '恭喜您预约成功！',
							  text: '"您已预约成功，稍后会有我们的工作人员为您确认，请留意电话~"',
							  onOK: function () {
								//点击确认
								
								window.history.go(-1);//-2则是后退两页
							  }
						   })
						}else{
							$.toast(r.data.message, "cancel");
						}
					})						
					.catch(function(error){
						//console.log(error);
						$.toast("服务器错误", "forbidden");
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