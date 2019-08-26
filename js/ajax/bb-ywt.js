document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	//console.log(JSON.parse(storage.getItem("userInfo")).Token);
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		RoleType:"",
		userInfo:"",
		dataTotal:11,
		count:1	,
		alltype:0,
		grade:"",
		typeInfo:"",
		dfp:"",
		dgj:"",
		gjz:"",
		ybb:"",
		ydf:"",
		yrg:"",
		yqy:"",	
		yjy:"",	
		ysx:"",	
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		// this.getData();
		this.getNum();
		this.getDfp();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted() { //下面表示已执行方法  编译好html后在这操作
	},
	methods:{
// 		getData:function(a){
// 			var _this=this;
// 			if(storage.getItem("userInfo")){
// 				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
// 				_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
// 				if(_this.RoleType=="3"||_this.RoleType=="4"){
// 					var useData={
// 						ReportSourceType: 4,
// 						ReceiveUserId:JSON.parse(storage.getItem("userInfo")).UserId,	
// 						ApiStatus:_this.alltype
// 					};					
// 				}else{
// 					var useData={
// 						ReportSourceType: 4,
// 						CompanyUserId: JSON.parse(storage.getItem("userInfo")).UserId,
// 						CompanyId:JSON.parse(storage.getItem("userInfo")).CompanyId,	
// 						ApiStatus:_this.alltype					
// 					};					
// 				}
// 					axios({
// 						method:"post",
// 						url:"/Customer/GetReport",
// 						data:JSON.stringify(useData)
// 					})
// 					 .then(function(r){
// 						 //console.log(r);
// 						 if(r.data.code=='1001'){
// 							 _this.userInfo=r.data.data.DataList;
// 							 _this.dataTotal=r.data.data.TotalRecord;
// 							 lstorage.setItem("bycontent",JSON.stringify(_this.userInfo));
// 						 }else{
// 							 $.toast("服务器繁忙", "text");
// 						 }
// 					 })
// 					 .catch(function(error){
// 							$.alert({
// 								title: '服务器错误',
// 								text: '"很抱歉，服务器出现错误，请稍后再试~"',
// 								onOK: function () {
// 								}
// 							 })					 
// 					 })
// 			 }else{
// 				 window.location.href="./login.html";
// 			 }
// 		},
		getDfp:function(){
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.alltype='0';
				axios.get("/Customer/GetStayCustomerList")
					.then(function(r){
						//console.log(r);
							 if(r.data.code=='1001'){
								 _this.userInfo=r.data.data.DataList;
								 _this.dfp=r.data.data.TotalRecord;
								 //console.log(_this.dfp);
								 _this.dataTotal=r.data.data.TotalRecord;
								 lstorage.setItem("bycontent",JSON.stringify(_this.userInfo));
							 }					
						
					})
					 .catch(function(error){
							$.alert({
								title: '服务器错误',
								text: '"很抱歉，服务器出现错误，请稍后再试~"',
								onOK: function () {
								window.location.href="login.html";
								}
							 })					 
					 })
			}				 
		},
		changeNum:function(n){
			n=n.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
			return n;
		},
		// 获取数量
		getNum:function(){
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
				if(_this.RoleType=="3"||_this.RoleType=="4"){
					var useData={
						ReportSourceType: 4,
						ReceiveUserId:JSON.parse(storage.getItem("userInfo")).UserId,	
						ApiStatus:_this.alltype								
					};					
				}else{
					var useData={
						ReportSourceType: 4,
						CompanyUserId: JSON.parse(storage.getItem("userInfo")).UserId,
						CompanyId:JSON.parse(storage.getItem("userInfo")).CompanyId,	
						ApiStatus:_this.alltype	
					};					
				}
					axios({
						method:"post",
						url:"/Customer/GetReportStatisticsNumber",
						data:JSON.stringify(useData)
					})
					 .then(function(r){
						 //console.log(r);
						 if(r.data.code=='1001'){
							 _this.dgj=r.data.data.StayFollow;
							 _this.gjz=r.data.data.AlreadyFollow;
							 _this.ybb=r.data.data.StayConfirmed+r.data.data.ReportEffective;//已报备=待确客+有效报备
							 _this.ydf=r.data.data.ReachEffective;
							 _this.yrg=r.data.data.Subscription;
							 _this.yqy=r.data.data.SignContract;
							 _this.yjy=r.data.data.Maid;
							 _this.ysx=r.data.data.AlreadyInvalid;
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
		reportInfo: function(e) {
			if(e==undefined){
				e="";
			}
			var _this=this;
			_this.alltype=e;
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
				if(_this.RoleType=="3"||_this.RoleType=="4"){
					var useData={
						ReportSourceType: 4,
						ReceiveUserId:JSON.parse(storage.getItem("userInfo")).UserId,	
						ApiStatus:e
					};					
				}else{
					var useData={
						ReportSourceType: 4,
						CompanyUserId: JSON.parse(storage.getItem("userInfo")).UserId,
						CompanyId:JSON.parse(storage.getItem("userInfo")).CompanyId,
						ApiStatus:e							
					};					
				}
					axios({
						method:"post",
						url:"/Customer/GetReport",
						data:JSON.stringify(useData)
					})
					 .then(function(r){
						 if(r.data.code=='1001'){
							 //console.log(r);
							 _this.userInfo=r.data.data.DataList;						 
							 _this.dataTotal=r.data.data.TotalRecord;
							 lstorage.setItem("bycontent",JSON.stringify(_this.userInfo));
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
			 }else{
				 window.location.href="./login.html";
			 }	
},		
		readMore:function(){
			var _this=this;
			_this.count++;
			if(storage.getItem("userInfo")){
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				_this.RoleType=JSON.parse(storage.getItem("userInfo")).RoleType;
				if(_this.RoleType=="3"||_this.RoleType=="4"){
					var useData={
						ReportSourceType: 4,
						ReceiveUserId:JSON.parse(storage.getItem("userInfo")).UserId,
						Status:_this.alltype,
						PageIndex:_this.count								
					};					
				}else{
					var useData={
						ReportSourceType: 4,
						CompanyUserId: JSON.parse(storage.getItem("userInfo")).UserId,
						CompanyId:JSON.parse(storage.getItem("userInfo")).CompanyId,
						Status:_this.alltype,
						PageIndex:_this.count
					};					
				}
					axios({
						method:"post",
						url:"/Customer/GetReport",
						data:JSON.stringify(useData)
					})
					 .then(function(r){
						 if(r.data.code=='1001'){
							 _this.dataTotal=r.data.data.TotalRecord;
							 _this.userInfo = (JSON.parse(lstorage.getItem("bycontent"))).concat(r.data.data.DataList);//合并两个数组
							 lstorage.setItem("bycontent",JSON.stringify(_this.userInfo));
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
			 }else{
				 window.location.href="./login.html";
			 }	
},		

 },
})