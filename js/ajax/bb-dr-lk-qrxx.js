document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	//console.log(JSON.parse(storage.getItem("userInfo")).Token);
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		UserId:"",
		Name:"",
		mobile:"",
		sex:"",
		grade:""
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
	methods:{
		getData:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				axios.get("/Customer/GetCustomerById",{
					params:{
						CustomerId:_this.getUrlParam('CustomerId')
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 _this.Name=r.data.data.FullName;
						 _this.mobile=r.data.data.Mobile;
						 _this.sex=r.data.data.Gender;
						 _this.grade=r.data.data.Star;
						 
					 }else{
						 $.toast(r.data.message, "text");
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
saveInfo:function(){
	var _this=this;
	var useData={
		FullName: _this.Name,
		Gender: _this.sex,
		Star: _this.grade,
		Id: _this.getUrlParam('id')		
	};
	axios({
		method:"post",
		url:"/Customer/UpdateReportUserMessage",
		data:JSON.stringify(useData)
	})
	.then(function(r){
		//console.log(r);
		if(r.data.code=='1001'){
			$.toast("提交成功","success");
			window.location.href="bb-dr-lk.html?ApiStatus=3";
		}else{
			$.toast("服务器错误","text");
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

		
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
	}
})