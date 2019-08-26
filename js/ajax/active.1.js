document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
var Sstorage=sessionStorage;

var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		activeInfo:"",
		msg:{
			name:"",
			phone:"",
			num:""
		},
		aTime:'',
		activeTime:{
			startTime:"",
			endTime:"",
			SignEndTime:"",
			activityRoute:"",
			activityContent:"",
			activityAddress:"",
			imgSrc:""
		},
		phoneNum:phoneNum,

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
		if(this.aTime!=''){
			console.log(this.aTime);
			this.getEndTime(this.aTime);
		}
	},
	methods:{
		getData:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				_this.msg.phone=JSON.parse(storage.getItem("userInfo")).Mobile;
			}				
			if(this.getUrlParam('id')!=null){
			axios.get("/Activity/GetActivityById",{
				params:{
					id:this.getUrlParam('id')
				}
			})
				.then(function(r){
					console.log(r);
                    if (r.data.code == "1001") {
						if(r.data.data.State==false){
							$.alert({
							  title: '该活动已下架~',
							  text: '"很抱歉，活动已下架，敬请期待下一次活动！"',
							  onOK: function () {
								//点击确认
								window.location.href=_this.getUrlParam('ym');
							  },
							})
						}else{
							_this.activeInfo=r.data.data;
							Sstorage.setItem("atitle",r.data.data.ActivityTitle);
							if(r.data.data.SignEndTime!="0"){
								_this.aTime=r.data.data.SignEndTime;
								console.log(_this.aTime);
								Sstorage.setItem("djs",_this.aTime);
								_this.getEndTime(_this.aTime);//设置倒计时
								// DOM还没有更新
								_this.$nextTick(() => {
									// DOM更新了
									_this.getEndTime(_this.aTime);
								})								
								
							}else{
								$.alert({
								  title: '该活动报名结束~',
								  text: '"很抱歉，该活动报名已结束，请选择其他活动~"',
								  onOK: function () {
									//点击确认
									window.location.href="./index.html";
								  }
							   })							
							}
							_this.activeTime.startTime=r.data.data.StartTime;
							_this.activeTime.endTime=r.data.data.EndTime;
							_this.activeTime.activityRoute=r.data.data.ActivityRoute;
							_this.activeTime.activityAddress=r.data.data.ActivityAddress;
							_this.activeTime.activityContent=r.data.data.ActivityDes;
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
						//点击确认
						window.location.href="./index.html";
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
			}else if(_this.msg.phone.length!=11){
				$.toast("电话填写有误~", "text");
			}
			else if(_this.msg.num==""){
				$.toast("人数不能为空~", "text");
			}else{
				if(storage.getItem("userInfo")){
					var data={
							ActivityId: this.getUrlParam('id'),
							FullName: _this.msg.name,
							Mobile: _this.msg.phone,
							Number: _this.msg.num,
							UserId:JSON.parse(storage.getItem("userInfo")).UserId		
					};
				}else{
					var data={
							ActivityId: this.getUrlParam('id'),
							FullName: _this.msg.name,
							Mobile: _this.msg.phone,
							Number: _this.msg.num				
					};				
				}
				axios({
				  method: 'post',
				  url: '/Activity/AddActivityEnroll',
				  data:  JSON.stringify(data),
				})
					.then(function(r){
						console.log(r);
						if(r.data.code=="1001"){
							$.alert({
							  title: '恭喜您报名成功！',
							  text: '"您已报名成功，稍后会有我们的工作人员为您确认，请留意电话~"',
							  onOK: function () {
								//点击确认
								location.reload();
							  }
						   })
						}else{
							$.toast(r.data.message, "cancel");
						}
					})						
					.catch(function(error){
						console.log(error);
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
		// 倒计时效果
		getEndTime:function(t){
			$(function(){  
				countDown(t,"#mtime .day","#mtime .hour","#mtime .minute","#mtime .second");  
				  
			});  
			  
			function countDown(time,day_elem,hour_elem,minute_elem,second_elem){  
				//if(typeof end_time == "string")  
				var end_time = new Date(time).getTime(),//月份是实际月份-1  
				current_time = new Date().getTime(),  
				sys_second = (end_time-new Date().getTime());  
				var timer = setInterval(function(){  
					if (sys_second > 0) {  
						sys_second -= 10;  
						var day = Math.floor((sys_second /1000/ 3600) / 24);  
						var hour = Math.floor((sys_second /1000/ 3600) % 24);  
						var minute = Math.floor((sys_second /1000/ 60) % 60);  
						var second = Math.floor(sys_second/1000 % 60);  
						var haomiao = Math.floor(sys_second%1000);  
						day_elem && $(day_elem).text(day);//计算天  
						$(hour_elem).text(hour<10?"0"+hour:hour);//计算小时  
						$(minute_elem).text(minute<10?"0"+minute:minute);//计算分  后面可+'分'
						$(second_elem).text(second<10?"0"+second:second);// 计算秒  
						$("#haomiao").text(haomiao);// 计算毫秒  
					}else {
						$("#mtime").remove();//删除倒计时显示层
						clearInterval(timer);  
					}  
				}, 10);  
			} 			
		}
	}
})