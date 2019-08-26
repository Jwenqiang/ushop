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
		userRole:"",
		CompanyName:"",
		CompanyKey:"",
		FullName:"",
		Mobile:"",
		RegionId:"",
		VerificationCode:"",
		phoneNum:phoneNum,
		allCity:{
			province:"",
			town:"",
		},			
		sheng:"",
		shi:"",
		no:true
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
// 		this.sheng = this.sheng[0].id;
// 		this.shi = this.shi[0].id;
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	updated:function(){
		// wxShared();	
	},	
	methods:{
		getData:function(){
			var _this=this;
			axios.get("/Region/GetRegionProvince",{
					params:{
						State:-1
					}
				})
				.then(function(r){
					if(r.data.code=='1001'){
						_this.allCity.province=r.data.data;
					}
// 					for(var i=0;i<_this.allCity.province.length;i++){
// 						_this.sheng[i]={label:_this.allCity.province[i].Name,value:_this.allCity.province[i].RegionId};
// 					}
				})
		},
		getArea:function(msg, event){
			var _this=this;
			if(_this.sheng!=""){
				_this.no=false;
				axios.get("/Region/GetRegionCityOrArea",{
					params:{
						RegionId:_this.sheng,
						State:-1
					}
				})
					.then(function(r){
						//console.log(r);
						if(r.data.code=='1001'){
							//console.log(_this.shi);
							_this.allCity.town=r.data.data;
						}
					})	
			}else{
				_this.no=true;
				_this.shi = _this.shi[0];
			}			
		},
// 待优化
// getArea:function(){
// 	var _this=this;
// 		weui.picker(_this.sheng,_this.shi,{
// 				onChange: function (result) {
// 					var _this=this;
// 						axios.get("/Region/GetRegionCityOrArea",{
// 							params:{
// 								RegionId:result
// 							}
// 						})
// 							.then(function(e){
// 								//console.log(e);
// 								if(e.data.code=='1001'){
// 									_this.shi=e.data.data;
// 								}
// 								for(var i=0;i<_this.shi.length;i++){
// 									_this.shi[i]={label:_this.shi[i].Name,value:_this.shi[i].RegionId};
// 								}		
// 								//console.log(_this.shi);
// 							})							
// 				},
// 				onConfirm: function (result) {
// 						//console.log(result);
// 						//console.log(result);
// 				}
// 		});
// },			
		
		
		
		
		
		goJoin:function(a){
			var _this=this;
			if(_this.shi!=""){
				_this.RegionId=_this.shi;
			}else{
				_this.RegionId=_this.sheng;
			}
			var useDada={
					CompanyName:_this.CompanyName,
					FullName:_this.FullName,
					Mobile:_this.Mobile,
					RegionId:_this.RegionId,
					VerificationCode:_this.VerificationCode,	
					Type:1			
			};
// 			if(storage.getItem("userInfo")){
// 				_this.userRole=JSON.parse(storage.getItem("userInfo")).RoleType;
			if(_this.CompanyName!=""&&_this.FullName!=""&&_this.Mobile!=""&&_this.RegionId!=""&&_this.VerificationCode!=""){
				axios({
					method:"post",
					url:"/System/AddApplyCooperation",
					data:JSON.stringify(useDada),
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 //console.log(r);

						$.confirm({
							title: '申请已提交',
							text: '稍后我们工作人员会与您联系，请耐心等待',
							onOK: function () {
							//点击确认
							window.location.href="./account.html";
							}
						 })	
					 }else{
						 $.toast(r.data.message, "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							//点击确认
							// window.location.href="./index.html";
							}
						 })					 
				 })
			}else{
				$.toast("选项不能为空", "text");
			}
		},

		// 获取验证码
		sendCode:function(){
			var _this=this;
			if(!(/^1[345678]\d{9}$/.test(_this.Mobile))) {
				$.toast("号码输入有误", "cancel");
			}else{		
			var useCode={
				Mobile: _this.Mobile,
				type:3       //数字的含义：1 用户注册 2 修改密码 3 申请合作
			};
			axios({
				method:"post",
				url:"/Users/AddUserVerificationCode",
				data:JSON.stringify(useCode)
			})
			.then(function(r){
				// _this.VerificationCode=r.data.data.VerificationCode;
				//console.log(r);
				//console.log(r.data.data.VerificationCode);
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