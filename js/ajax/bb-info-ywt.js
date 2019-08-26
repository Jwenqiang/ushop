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
		bbInfo:[],
		jdInfo:[],
		Gender:"",
		grade:"",
		bbDfp:false
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
		this.getDfp();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	methods:{
		getData:function(a){
			var _this=this;
			if(storage.getItem("userInfo")&&_this.getUrlParam('id')){
			
				axios.get("/Customer/GetReportById",{
					params:{
						Id: _this.getUrlParam('id')
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 _this.bbInfo=r.data.data;
						 _this.jdInfo=r.data.data.ReportClientDailyList;
						 if(r.data.data.CustomerStar=='0'){
							 _this.grade='A';
						 }
						 if(r.data.data.CustomerStar=='1'){
							 _this.grade='B';
						 }	
						 if(r.data.data.CustomerStar=='2'){
							 _this.grade='C';
						 }											  
						 if(r.data.data.CustomerStar=='3'){
							 _this.grade='D';
						 }						 
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
		},
		getDfp:function(a){
			var _this=this;
			if(storage.getItem("userInfo")&&_this.getUrlParam('uid')){
			
				axios.get("/Customer/GetCustomerById",{
					params:{
						CustomerId: _this.getUrlParam('uid')
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 _this.bbDfp=true;
						 _this.bbInfo=r.data.data;
					 
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