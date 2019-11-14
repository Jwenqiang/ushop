// 验证令牌
// axios.defaults.headers.common['Authorization'] = "AUTH_TOKEN";
var storage=window.localStorage;
var Sstorage=sessionStorage;

var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		zx:{
			Title:"",
			AddTime:"",
			Content:"",
		},
		house_zx:"",
		correlation:{
			Id:"",
			ProjectName:"",
			MainImg:"",
			Aprice:"",
			ProjectId:"",
		},//关联的楼盘
		isShare:false,
		tp:"",
		ms:" ",
		bt:"",
		u:"",
		msg:{
			name:"",
			phone:"",
			num:""
		},
		SourceUserId:"",
		callNum:"",
		phoneMsg:"",
		phoneF:"",
		phoneL:"",	
		callPhone:false,
		isMobile:false,
		isF:true,
		wz:false,
		imgUrls:"",
		oldImglist:[],
		newImglist:[]		
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
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
			var href = window.location.href;
			href = href.substring(href.lastIndexOf("/") + 1);
			if (Sstorage.getItem(href)) {
				$(".whole").scrollTop(Number(Sstorage.getItem(href)));
			}
			// wxShared();
	},	
	methods:{
		getData:function(a){
			if(this.getUrlParam("SourceUserId")){
				this.SourceUserId=this.getUrlParam("SourceUserId")
			}				
			if(storage.getItem("userInfo")){
				// 验证令牌
				axios.defaults.headers.common['token'] =JSON.parse(storage.getItem("userInfo")).Token
				this.msg.phone=JSON.parse(storage.getItem("userInfo")).Mobile
			}				
			var _this=this;
			axios.get("/Information/GetInformationById",{
				params:{
					id:this.getUrlParam('id'),
					SourceUserId:_this.SourceUserId
				}
			})
			 .then(function(r){
				 console.log(r)
				 if(r.data.code=='1001'){
					 _this.zx.Title=r.data.data.Title;
					 $('title').html( _this.zx.Title);					 
					 // 微信分享数据
					_this.ms=r.data.data.Introduction;
					_this.bt=r.data.data.Title;
					
					if(r.data.data.TelePhone!=''&&r.data.data.TelePhone!=null){
						_this.callNum=r.data.data.TelePhone;
						if(r.data.data.TelePhone.indexOf(",")<0){
							_this.isMobile=true
						}
					}
					_this.u=window.location.href;
					 if(r.data.data.CoverUrl!=""){
						_this.tp=r.data.data.CoverUrl;
					 }else{
						_this.tp="https://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg";
					}
	wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
	// 旧版
		wx.onMenuShareTimeline({ 
			title: _this.bt, // 分享标题
			desc: _this.ms, // 分享描述
			link: _this.u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _this.tp, // 分享图标
			success: function () {
			  // 设置成功
			  console.log(33);
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
											  
					 _this.zx=r.data.data;
					 _this.zx.AddTime=r.data.data.AddTime;
					 _this.zx.Content=r.data.data.Content;
					 // 关联楼盘
					 _this.correlation.ProjectId=r.data.data.ProjectId;
					 _this.correlation.Id=r.data.data.Id;
					 _this.correlation.ProjectName=r.data.data.ProjectName;
					 _this.correlation.MainImg=r.data.data.MainImg;
					 _this.correlation.Aprice=r.data.data.Aprice;
					 // 推荐阅读
					_this.house_zx=r.data.data.InformationList;
					
							// 富文本图片处理点击放大
							_this.imgUrls=_this.zx.Content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi);
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
					
					// DOM还没有更新
					_this.$nextTick(() => {
						_this.getShare();
					})					
				 }else{
					 _this.wz=true;
					 // $.toast(r.data.message, "text");
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
		},

	getShare:function(){
		axios({
			method:"post",
			url:"/Wx/GetJsSdkUiPackage",
			data:JSON.stringify({Url:this.u})
		})
		.then(function(e){
			console.log(e);
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
			else if(_this.msg.num==""){
				$.toast("人数不能为空~", "text");
			}else{

				var data={
					ActivityId: this.getUrlParam('id'),
					FullName: _this.msg.name,
					Mobile: _this.msg.phone,
					Number: _this.msg.num,
					EnrollType:2,
					SourceUserId:_this.SourceUserId
				};				

				axios({
				  method: 'post',
				  url: 'Activity/AddActivityEnroll',
				  data:  JSON.stringify(data),
				})
					.then(function(r){
						//console.log(r);
						if(r.data.code=="1001"){
							_this.isF=false;
							$.alert({
							  title: '恭喜您报名成功！',
							  text: '"您已报名成功，稍后会有我们的工作人员为您确认，请留意电话~"',
							  onOK: function () {
								//点击确认
								
							  }
						   })
						}else{
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
			if(p.indexOf(",")>-1){
				_this.phoneMsg=p;
				var index=_this.phoneMsg.indexOf("\,");
				_this.phoneF=_this.phoneMsg.substring(0,index);
				_this.phoneL=_this.phoneMsg.substring(index+1,_this.phoneMsg.length);
				_this.callPhone=true;				
			}
		},				
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},	
		imgChange(e){
			console.log(e);
			wx.previewImage({
			  current: e.target.src, // 当前显示图片的http链接
			  urls: this.oldImglist // 需要预览的图片http链接列表
			}) 			
		}			
	}
})