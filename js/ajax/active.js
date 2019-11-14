var storage=window.localStorage;
var Sstorage=sessionStorage;

var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		SourceUserId:"",
		activeInfo:"",
		msg:{
			name:"",
			phone:"",
			num:"",
			gs:"",
			qdjl:""
		},
		aTime:'',
		activeTime:{
			startTime:"",
			endTime:"",
			SignEndTime:"",
			activityRoute:"",
			activityContent:"",
			activityAddress:"",
			imgSrc:"",
			ActivityPhone:""
		},
		phoneNum:phoneNum,
		tian:'0',
		shi:'0',
		fen:'0',
		miao:'0',
		noTime:false,
		isShare:false,
		tp:"",
		ms:" ",
		bt:"",
		u:"",
		isF:true,		
		isOther:false,
		callPhone:false,
		phoneMsg:"",
		phoneF:"",
		phoneL:"",
		isFoot:true	,
		showTip:false,
		activeId:"",
		isQd:false,
		imgUrls:"",
		oldImglist:[],
		newImglist:[],
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
	// 判断是否是其他链接渠道过来
	this.activeId=this.getUrlParam('id');
	console.log(this.activeId);
		if(this.getUrlParam('ActivityChannelId')>0){
			this.isOther=true;
		}
		this.getData();
		// this.WXshare();
		if(this.getUrlParam('from')){
			this.isShare=true;
		}
 // 微信分享数据
		// Sstorage.setItem("urlf",window.location.href);		
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	updated:function(){
		$("#loadingDiv1").fadeOut(300);	
		if($("#abm").hasClass("noB")){
			$(".noB input").attr({"readonly":"readonly","disabled":"disabled"});
			$(".noB button").attr("disabled","disabled");
			$(".noB button").text("报名已结束");
			$(".noB button").css({"background":"#ccc","boxShadow":"none"});				
		}
		// wxShared();
	},
	methods:{
		getData:function(a){
			var _this=this;
			// shareData("http://hfugweb.centaline.com.cn/activity.html?id=16");	
			if(storage.getItem("userInfo")){
				_this.msg.phone=JSON.parse(storage.getItem("userInfo")).Mobile;
			}				
			if(this.getUrlParam('id')!=null){
			axios.get("/Activity/GetActivityById",{
				params:{
					id:this.getUrlParam('id'),
					SourceUserId:this.getUrlParam('SourceUserId')
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
								if(_this.getUrlParam('ym')){
									window.location.href=_this.getUrlParam('ym');
								}else{
									window.location.href="index.html";
								}
							  },
							})
						}else{
							_this.activeInfo=r.data.data;
							if(r.data.data.CategoryId==7){
								_this.isQd=true;
							}
							$('title').html(r.data.data.ActivityTitle);
					 // 微信分享数据
					 // Sstorage.setItem("urlf",window.location.href);
					 // Sstorage.setItem("bt",r.data.data.ActivityTitle);
					 _this.bt=r.data.data.ActivityTitle;
					 _this.u=window.location.href;
					 console.log(_this.u);
					 if(r.data.data.CoverImg!=""){
						// Sstorage.setItem("tp",r.data.data.CoverImg); 
						_this.tp=r.data.data.CoverImg;
					 }else{
						// Sstorage.setItem("tp","http://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg");
						_this.tp="https://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg";
					}
					// Sstorage.setItem("ms",r.data.data.ActivityTitleSecond);
					_this.ms=r.data.data.ActivityTitleSecond;
	wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
	// 旧版
		wx.onMenuShareTimeline({ 
			title: _this.bt, // 分享标题
			desc: _this.ms, // 分享描述
			link: _this.u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _this.tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})
		wx.onMenuShareAppMessage({ 
			title: _this.bt, // 分享标题
			desc: _this.ms, // 分享描述
			link: _this.u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _this.tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})		
		wx.onMenuShareQQ({ 
			title: _this.bt, // 分享标题
			desc:_this.ms, // 分享描述
			link: _this.u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _this.tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})	
		wx.onMenuShareWeibo({ 
			title: _this.bt, // 分享标题
			desc: _this.ms, // 分享描述
			link: _this.u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _this.tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})
		wx.onMenuShareQZone({ 
			title: _this.bt, // 分享标题
			desc: _this.ms, // 分享描述
			link: _this.u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _this.tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})
	});					
							if(r.data.data.SignEndTime!="0"){
								_this.aTime=r.data.data.SignEndTime;
								//console.log(_this.aTime);
								Sstorage.setItem("djs",_this.aTime);
								_this.getEndTime(_this.aTime);//设置倒计时							
								//console.log(_this.tian);
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
							if(_this.isOther==false){
								_this.activeTime.ActivityPhone=r.data.data.ActivityPhone;								
								_this.activeTime.activityContent=r.data.data.ActivityDes;	
							}else{
								_this.activeTime.ActivityPhone=r.data.data.CentanetActivityPhone;
								_this.activeTime.activityContent=r.data.data.CentanetActivityDes;
							}
							
							// 富文本图片处理点击放大
							_this.imgUrls=_this.activeTime.activityContent.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi);
							let arrImg=[];
							let srcList=[];
							for(var j=0;j<_this.imgUrls.length;j++){
								_this.imgUrls[j].replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
									arrImg.push(capture);
									srcList.push(capture+'?x-oss-process=image/ratate,270')
								})
							}
							_this.oldImglist=arrImg;
							_this.newImglist=srcList;
							
						}
						// DOM还没有更新
						_this.$nextTick(() => {
							_this.getShare();
						})						
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
	getShare:function(){
		axios({
			method:"post",
			url:"/Wx/GetJsSdkUiPackage",
			data:JSON.stringify({Url:this.u})
		})
		.then(function(e){
			if(e.data.code==1001){
			  wx.config({
				  debug: false,
				  appId: e.data.data.AppId,
				  timestamp: e.data.data.Timestamp,
				  nonceStr: e.data.data.NonceStr,
				  signature: e.data.data.Signature,
				  jsApiList: ["updateAppMessageShareData","updateTimelineShareData","onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo","onMenuShareQZone",
						"chooseImage", "getNetworkType", "hideOptionMenu", "showOptionMenu", "hideMenuItems",
						"showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow"
					]
			  });			
			}
		})	
		.catch(function(n){
			
		})		
	},
		// 活动报名
		goActive:function(){
			var _this=this;
			if(_this.msg.name==""){
				$.toast("姓名不能为空~", "text");
			}else if(_this.msg.phone==""){
				$.toast("电话不能为空~", "text");
			}else if(!(/^1[345678]\d{9}$/.test(_this.msg.phone))){
				$.toast("电话填写有误~", "text");
			}
			else if(_this.msg.num==""&&_this.isQd==false){
				$.toast("人数不能为空~", "text");
			}else if(_this.msg.gs==""&&_this.isQd==true){
				$.toast("请填写公司名~", "text");
			}else if(_this.msg.qdjl==""&&_this.isQd==true){
				$.toast("请填写渠道经理~", "text");
			}else{
				if(storage.getItem("userInfo")){
					var data={
                            ActivityWebId: this.getUrlParam('id'),
							FullName: _this.msg.name,
							Mobile: _this.msg.phone,
							Number: _this.msg.num,
							UserId:JSON.parse(storage.getItem("userInfo")).UserId,
							ActivityChannelId:this.getUrlParam('ActivityChannelId'),
							SourceUserId:this.getUrlParam('SourceUserId'),
							EnrollCompany:_this.msg.gs,
							EnrollChannelManage:_this.msg.qdjl
					};
				}else{
					var data={
                            ActivityWebId: this.getUrlParam('id'),
							FullName: _this.msg.name,
							Mobile: _this.msg.phone,
							Number: _this.msg.num,
							ActivityChannelId:this.getUrlParam('ActivityChannelId'),
							SourceUserId:this.getUrlParam('SourceUserId'),
							EnrollCompany:_this.msg.gs,
							EnrollChannelManage:_this.msg.qdjl														
					};				
				}
				axios({
				  method: 'post',
				  url: '/Activity/AddActivityEnroll',
				  data:  JSON.stringify(data),
				})
					.then(function(r){
						//console.log(r);
						if(r.data.code=="1001"){
							_this.isF=false;
							if(_this.isQd==false){
								$.alert({
								  title: '恭喜您报名成功！',
								  text: '"您已报名成功，稍后会有我们的工作人员为您确认，请留意电话~"',
								  onOK: function () {
									//点击确认
									location.reload();
									_this.isF=true;
								  }
							   })								
							}else{
								$.alert({
								  title: '恭喜您报名成功！',
								  text: '<div style="width:100%;height:180px;"><p style="font-size: 14px;">长按识别二维码,添加客服微信</p><img src="./img/a-ewm.jpg" style="width:150px;height:150px;"/><p style="font-size: 14px;">核对报名信息</p></div> ',
								  onOK: function () {
									//点击确认
									location.reload();
									_this.isF=true;
								  }
							   })								
							}

						}else{
							console.log(1);
							$.toast(r.data.message, "cancel");
						}
					})						
					.catch(function(error){
						//console.log(error);
						$.toast("服务器错误", "forbidden");
					})
			}
		},
		// 点击拨打电话
		callP:function(p){
			var _this=this;
			_this.phoneMsg=p;
			console.log(p);
			var index=_this.phoneMsg.indexOf("\,");
			console.log(index);
			_this.phoneF=_this.phoneMsg.substring(0,index);
			_this.phoneL=_this.phoneMsg.substring(index+1,_this.phoneMsg.length);
			_this.callPhone=true;
		},		
		// 进入海报页面
		
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
		// 倒计时效果
		getEndTime:function(time){
			var _this=this;
// 			
// let arr = time.split(/[- :]/);//时间格式为'2018-08-07 10:23:00'
// //console.log(arr);
// let nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
// //console.log(nndate);
//     nndate=Date.parse(nndate)
// 
// let timeLeft = nndate- new Date();	
// 		//console.log(nndate);
// 		//console.log(timeLeft);
			var end_time = new Date(time.replace(/-/g,'/')).getTime();//月份是实际月份-1  
			var current_time = new Date().getTime();  
			var sys_second = (end_time-new Date().getTime()); 
			 //console.log(end_time);
			 //console.log(current_time);
			 //console.log(sys_second);
			var timer = setInterval(function(){  
				if (sys_second > 0) {  
					sys_second -= 10;  
					var day = Math.floor((sys_second /1000/ 3600) / 24);  
					var hour = Math.floor((sys_second /1000/ 3600) % 24);  
					var minute = Math.floor((sys_second /1000/ 60) % 60);  
					var second = Math.floor(sys_second/1000 % 60);  
					var haomiao = Math.floor(sys_second%1000);  
					_this.tian=day;
					_this.shi=hour<10?"0"+hour:hour;
					_this.fen=minute<10?"0"+minute:minute;
					_this.miao=second<10?"0"+second:second;
				}else {
					clearInterval(timer);  
				}  
			}, 10);  
		},
		imgChange(e){
			console.log(e.target);
			wx.previewImage({
			  current: e.target.src, // 当前显示图片的http链接
			  urls: this.oldImglist // 需要预览的图片http链接列表
			}) 			
		}
	}
})