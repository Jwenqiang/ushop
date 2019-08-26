document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		userL:false,
		UserId:"",
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
		getData:function(){
			var _this=this;
			// 如果是已登陆用户
			if(storage.getItem("userInfo")){
				_this.userL=true;
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
			}else{
				window.location.href="./login.html";
			}
		},
		exitUser:function(){
			storage.clear();
			lstorage.clear();
			window.location.href="./login.html";
		}
	}
})