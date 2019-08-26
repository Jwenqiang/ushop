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
		hdList:"",
		SignEndTime:"",
		activityEnd:false,
		tian:0,
		shi:0,
		fen:0,
		miao:0,
		noTime:false,
		datetime:[]
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
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.userRole=JSON.parse(storage.getItem("userInfo")).RoleType;
				axios.get("/Users/GetMsgNoticeByType",{
					params:{
						PageSize: 10,
						PageIndex:1,
						Type:1
					}
				})
                    .then(function (r) {
					 if(r.data.code=='1001'){
						 _this.getEndTime(r.data.data.DataList);
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
							window.location.href="index.html";
							}
						 })					 
				 })
			 }else{
				 window.location.href="login.html";
			 }
		},
		// 倒计时效果
		getEndTime:function(time){
			var that=this;
			// var end_time = new Date(time.replace(/-/g,'/')).getTime();//月份是实际月份-1  
			// var current_time = new Date().getTime();  
			// var sys_second = (end_time-new Date().getTime());  
			// var timer = setInterval(function(){  
			// 	if (sys_second > 0) {  
			// 		sys_second -= 10;  
			// 		var day = Math.floor((sys_second /1000/ 3600) / 24);  
			// 		var hour = Math.floor((sys_second /1000/ 3600) % 24);  
			// 		var minute = Math.floor((sys_second /1000/ 60) % 60);  
			// 		var second = Math.floor(sys_second/1000 % 60);  
			// 		var haomiao = Math.floor(sys_second%1000);  
			// 		_this.tian=day;
			// 		_this.shi=hour<10?"0"+hour:hour;
			// 		_this.fen=minute<10?"0"+minute:minute;
			// 		_this.miao=second<10?"0"+second:second;
			// 	}else {
			// 		clearInterval(timer);  
			// 	}  
			// }, 10);  
		// 倒计时时间转换为时间戳
			var dates=[];
			for (var i in time){
				var end_time = new Date((time[i].SignEndTime).replace(/-/g, '/')).getTime();//月份是实际月份-1  
				var current_time = new Date().getTime();
				var sys_second = (end_time - new Date().getTime()); 
				dates.push({dat:sys_second});
			}
			that.datetime=dates;
			// 倒计时执行
			// let that = this;
			let len = that.datetime.length;//时间数据长度
			var timer=setInterval(function(){//时间函数
			  for (var i = 0; i < len; i++) {
				var intDiff = that.datetime[i].dat;//获取数据中的时间戳
				if (intDiff > 0) {//转换时间
				  that.datetime[i].dat -= 1000;
				  var day = Math.floor((intDiff / 1000 / 3600) / 24);
				  var hour = Math.floor((intDiff / 1000 / 3600) % 24);
				  var minute = Math.floor((intDiff / 1000 / 60) % 60);
				  var second = Math.floor(intDiff / 1000 % 60);
			  
				  if (hour <= 9) hour = '0' + hour;
				  if (minute <= 9) minute = '0' + minute;
				  if (second <= 9) second = '0' + second;
				  var str = day+","+ hour + ',' + minute + ',' + second
				  that.datetime[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
				  time[i].djs = that.datetime[i].difftime;
					that.hdList=time;       
				} else {
				  time[i].djs ="0,0,0";
				  that.hdList=time;
				  return false;
				  // clearInterval(timer);
				}
			  }

			}, 1000)
			
		},
	  dTime: function (value) {
		if(value!=undefined){
		  if(value.indexOf(",")>-1){
			return value.split(",");
		  }
		}
	  }		
	}
})