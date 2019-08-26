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
		userInfoList:[],
		CustomerList:[],
		ProjectList:[],
		CompanyUserId:"",
		CompanyId:"",
		yes:true
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted() { //下面表示已执行方法  编译好html后在这操作
	},
	methods:{

addList:function(){
	var _this=this;
	_this.userInfoList.push({FullName:'',Mobile:'',Gender:''})
},
minusList:function(index){
	var _this=this;
	_this.userInfoList.splice(index, 1);
},
		goReport:function(){
			var _this=this;
			$.showLoading("委托中");
			//console.log(_this.userInfoList)
			if(storage.getItem("userInfo")){
				_this.CompanyUserId=JSON.parse(storage.getItem("userInfo")).UserId; 
				_this.CompanyId=JSON.parse(storage.getItem("userInfo")).CompanyId; 
				var sessionstorage=window.sessionStorage;
				if(_this.userInfoList!=''){
// 数组对象校验号码是否重复
					var result = [];
					var obj = {};
					for(var i =0; i<_this.userInfoList.length; i++){
							if(_this.userInfoList[i].FullName==''){
								$.hideLoading();
								$.toast("客户姓名必填", "cancel");
								return false;
							}
							else if(!(/^1[345678]\d{9}$/.test(_this.userInfoList[i].Mobile))){
								$.hideLoading();
								$.toast("号码填写有误", "cancel");
								return false;
							}
							else if(_this.userInfoList[i].Gender==''){
								$.hideLoading();
								$.toast("客户性别必选", "cancel");
								return false;
							}else{
							   if(!obj[_this.userInfoList[i].Mobile]){
								  result.push(_this.userInfoList[i]);
								  obj[_this.userInfoList[i].Mobile] = true;
							   }else{
								   $.hideLoading();
									$.toast("号码不能重复", "cancel");
									return false;
								}
							}
				   }					
					var useDada={
						CustomerList:_this.userInfoList,
						CompanyUserId:_this.CompanyUserId,
						CompanyId:_this.CompanyId,				
					};
					axios({
						method:"post",
						url:"/Customer/AddCustomer",
						data:JSON.stringify(useDada)
					})
					.then(function(r){
						// 报备信息提交成功执行操作
						//console.log(r);
						if(r.data.code="1001"){
							$.hideLoading();
							$.toast("委托成功", "success");
							window.location.href="bb-ywt.html";
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
					$.toast("请添加客户", "text");
				}
			}else{
				 window.location.href="./login.html";
			}				
		},
		
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;	
		},
 },
})