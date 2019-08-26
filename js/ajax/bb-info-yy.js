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
		role:"",
		UserId:"",
		bbInfo:[],
		jdInfo:[],
		Gender:"",
		logList:"",
		log:"",
		status:"",
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
				_this.role=JSON.parse(storage.getItem("userInfo")).RoleType; 
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
						 _this.logList=r.data.data.ReportUserLogList;
						 //console.log(_this.jdInfo);
						 if(r.data.data.Gender=='0'){
							 _this.Gender='未知';
						 }
						 if(r.data.data.Gender=='1'){
							 _this.Gender='先生';
						 }	
						 if(r.data.data.Gender=='2'){
							 _this.Gender='女士';
						 }	
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
addLog:function(){
	var _this=this;
	var useData={
  ReportId: _this.getUrlParam('id'),
  Remarks: _this.log,		
	}
	axios({
		method:"post",
		url:"/Customer/AddReportUserLog",
		data:JSON.stringify(useData)
	})
	.then(function(r){
		//console.log(r)
		if(r.data.code=='1001'){
			$.toast("添加成功","text");
			_this.getData();
		}else{
			$.toast("服务器错误","text");
		}
	})
	.catch(function(e){
		$.alert({
			title: '服务器错误',
			text: '"很抱歉，服务器出现错误，请稍后再试~"',
			onOK: function () {
			// window.location.href="./index.html";
			}
		 })			
	})
},
delLog:function(id){
	var _this=this;
	$.confirm({
		title: '',
		text: "确定删除该日志？",
		onOK: function() {	
			axios.delete("/Customer/DelReportUserLog",{
				params:{
					id: id
				}
			})
			.then(function(r){
				if(r.data.code=='1001'){
					$.toast("删除成功","success");
					_this.getData();
				}else{
					$.toast("服务器错误","text");
				}
			})
		.catch(function(e){
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