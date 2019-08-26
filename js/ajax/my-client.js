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
		RoleType:"",
		UserId:"",
		allData:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted() { //下面表示已执行方法  编译好html后在这操作
	},
	updated:function(){
		// wxShared();	
	},	
	methods:{
		
		
		getData:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				if(JSON.parse(storage.getItem("userInfo")).RoleType==2){
					_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
					_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
						axios.get("/Customer/GetReportCompanyTotalNumberStatistics",{
							params:{
								CompanyUserId: JSON.parse(storage.getItem("userInfo")).UserId,
								CompanyId:JSON.parse(storage.getItem("userInfo")).CompanyId,							
							}
						})
						 .then(function(r){
							 //console.log(r);
							 if(r.data.code=='1001'){
								 _this.allData=r.data.data
							 }else{
								 $.toast(r.data.message, "text");
							 }
						 })
						 .catch(function(error){
							 window.location.href="login.html";
// 								$.alert({
// 									title: '服务器错误',
// 									text: '"很抱歉，服务器出现错误，请稍后再试~"',
// 									onOK: function () {
// 									// window.location.href="./index.html";
// 									}
// 								 })					 
						 })
					 }
				 if(JSON.parse(storage.getItem("userInfo")).RoleType==3){
					_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
					_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
					var useData={
						ReceiveUserId: JSON.parse(storage.getItem("userInfo")).UserId,
						ReportSourceType:3						
					};
						axios({
							method:'post',
							url:"/Customer/GetReportStatisticsNumber",
							data:JSON.stringify(useData)
						})
						 .then(function(r){
							 //console.log(r);
							 if(r.data.code=='1001'){
								 _this.allData=r.data.data
							 }else{
								 $.toast("服务器繁忙", "text");
							 }
						 })
						 .catch(function(error){
							 window.location.href="login.html";
// 								$.alert({
// 									title: '服务器错误',
// 									text: '"很抱歉，服务器出现错误，请稍后再试1~"',
// 									onOK: function () {
// 									// window.location.href="./index.html";
// 									}
// 								 })					 
						 })						 
				 }
				 if(JSON.parse(storage.getItem("userInfo")).RoleType==4){
					_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
					_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
					var useData={
						ReceiveUserId: JSON.parse(storage.getItem("userInfo")).UserId,
						ReportSourceType:4						
					};
						axios({
							method:'post',
							url:"/Customer/GetReportStatisticsNumber",
							data:JSON.stringify(useData)
						})
						 .then(function(r){
							 //console.log(r);
							 if(r.data.code=='1001'){
								 _this.allData=r.data.data
							 }else{
								 $.toast("服务器繁忙", "text");
							 }
						 })
						 .catch(function(error){
							window.location.href="login.html";							 
// 								$.alert({
// 									title: '服务器错误',
// 									text: '"很抱歉，服务器出现错误，请稍后再试1~"',
// 									onOK: function () {
// 									// window.location.href="./index.html";
// 									}
// 								 })					 
						 })						 
				 }				 
			 }else{
				 window.location.href="./login.html";
			 }
		},

 },
})