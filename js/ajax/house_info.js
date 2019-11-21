var storage=window.localStorage;	
var lstorage=window.sessionStorage;
if(storage.getItem("userInfo")){
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	// var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		product:"",
		mainInfo:"",//其他属性
		roll:"",//优惠券
		imgArr:[],
		houseType:[],
		houseCount:[],
		infoId:"",
		houseJd:"",//楼盘解读
		productList:"",
		imgBan:[],
		hxBan:[],
		price:"",
		Xpoint:"",
		Ypoint:"",
		services:"",
		showZx: false,
		htitle:"",
		isShare:false,
		callPhone:false,
		phoneMsg:"",
		phoneF:"",
		phoneL:"",
		tp:"",
		ms:"",
		bt:"",
		u:"",
		SourceUserId:"",
		userToken:"",
		productYj:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		if(storage.getItem("userInfo")){
			this.userToken=JSON.parse(storage.getItem("userInfo")).Token;
		}		
		this.getData();
		if(this.getUrlParam('from')){
			this.isShare=true;
		}
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作
		
	},
	updated:function(){	
		if(this.Xpoint!=''&&this.Xpoint!=null){
			this.getMap();
		}
		$("#loadingDiv1").fadeOut(300);	
		// wxShared();
	},	
	methods:{		
		getData:function(a){
			if(this.getUrlParam("SourceUserId")){
				this.SourceUserId=this.getUrlParam("SourceUserId")
			}
			var _this=this;
			_this.infoId=_this.getUrlParam("id");
			// 公共提交数据格式
			if(_this.getUrlParam("id")!=null){
				axios.get("/Project/GetProjectById",{
					params:{
						id:_this.getUrlParam("id")
					}
				})
				.then(function(r){
					if(r.data.code=='1001'){
						_this.htitle=r.data.data.ProjectName;
						$('title').html(_this.htitle+"-楼盘详情");							
					 // 微信分享数据
					_this.bt=r.data.data.ProjectName;
					_this.u=window.location.href;
					 if(r.data.data.MainImg!=""){
						 _this.tp=r.data.data.MainImg;
						// Sstorage.setItem("tp",r.data.data.MainImg); 
					 }else{
						// Sstorage.setItem("tp","http://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg");
						_this.tp="https://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg";
					}
					if(r.data.data.Aprice==0){
						// Sstorage.setItem("ms","均价待定"+",评分"+r.data.data.ProjectScore+"分");	
						_this.ms="均价待定"+",评分"+r.data.data.ProjectScore+"分";
					}else{
						// Sstorage.setItem("ms","均价"+r.data.data.Aprice+"元/㎡"+",评分"+r.data.data.ProjectScore+"分");	
						_this.ms="均价"+r.data.data.Aprice+"元/㎡"+",评分"+r.data.data.ProjectScore+"分";
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
			desc: _this.ms, // 分享描述
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
					
					
							console.log(r);			
						_this.product=r.data.data;
						_this.productYj=r.data.data.ProjectAwardList;
						console.log(_this.productYj);
						_this.imgBan=r.data.data.Estate.EstatePhotosAllList;
						//console.log(_this.imgBan);
						_this.houseJd=r.data.data.Information;
						_this.mainInfo=r.data.data.Estate;
						_this.roll=r.data.data.Coupon;
                        _this.houseType = r.data.data.Estate.PropertyRoomTypeList;
						//console.log(_this.houseType);
						_this.services=r.data.data.ProjectAdviserList;
						_this.price=r.data.data.Aprice;
						// 保存经纬度
						_this.Xpoint=r.data.data.AddressXpoint;
						_this.Ypoint=r.data.data.AddressYpoint;
						lstorage.setItem('pointName',r.data.data.ProjectName);
						lstorage.setItem('addr',r.data.data.Estate.Address);
						lstorage.setItem('IMG',r.data.data.MainImg);
						lstorage.setItem('x',_this.Xpoint);
						lstorage.setItem('y',_this.Ypoint);
						// DOM还没有更新
						_this.$nextTick(() => {
							// DOM更新了
							// swiper重新初始化
							/* eslint-disable no-new */
							_this.slide0();
							_this.slide1();
							_this.getShare();
						})						
						_this.getProduct();
						
					}else{
						$.toast("该楼盘已下架", "text");
						setTimeout(function(){
							window.location.href="house-list.html";
						},500)
					}
				})
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试1~"',
							onOK: function () {
							// window.location.href="./index.html";
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
		getProduct:function(){
			var _this=this;
			var useData={
				pageIndex:1,
				pageSize:5,
				Id: _this.getUrlParam("id"),
				Aprice: _this.price,				
			};
			axios({
				method:"post",
				url:"/Project/GetProjectPageList",
				data:JSON.stringify(useData)
			})
				.then(function(r){
					//console.log(r);
					if(r.data.code=='1001'){
						_this.productList=r.data.data.ProjectList.DataList;
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
		},		
		slide0:function(){
			var mySwiper0 = new Swiper('.swiper-container0',{  
				loop:true,
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				  },	
			}) 		
		},		
		slide1:function(){
			var mySwiper = new Swiper('.swiper-container',{  
				//一屏三个
				slidesPerView : 2.3,
				loop:false,
				//每个的距离
				spaceBetween : 10,  	
				freeMode: true,  
				freeModeFluid: true,
				//是否有拖动惯性
				freeModeMomentum : true,
			}) 			
		},
		getMap:function(){
			var lstorage=window.sessionStorage;
			var pointName=lstorage.getItem('pointName');
			var x=lstorage.getItem("x");
			var y=lstorage.getItem("y");	
			
	// 百度地图API功能
	var map = new BMap.Map("container");          
	var point=new BMap.Point(x,y);  
	map.enableScrollWheelZoom();
	// 标注
	map.centerAndZoom(point, 15);
	
	// 添加一个控件
	map.addControl(new BMap.NavigationControl());
	var marker = new BMap.Marker(point);        // 创建标注    
	map.addOverlay(marker);                     // 将标注添加到地图中 				
// 显示label
var label = new BMap.Label(pointName, {
 offset: new BMap.Size(20, 0)
 }); //创建marker点的标记,这里注意下,因为百度地图可以对label样式做编辑,
 label.setStyle({
	display: "block",
	border:"1px solid #dedede",
	background: '#f5f5f7',
	boxShadow: '0 0 10px #ddd',
	borderRadius: '4px',
	padding:"5px 15px"
 }); //对label 样式隐藏 
 marker.setLabel(label); //把label设置到maker上 			
									
									
// 			var map = new AMap.Map("container", {
// 				resizeEnable: true,
// 				zoom: 15,
// 				//显示的地图中心点
// 				center: [x, y]
// 			});
// 		
// 			//添加点标记，并使用自己的icon
// 			var marker = new AMap.Marker({
// 				map: map,
// 				//需要标记的地图中心点
// 				position: [x, y],
// 				icon: new AMap.Icon({
// 					size: new AMap.Size(24, 31), //图标大小
// 					image: "img/mark2.png",
// 				}),
// 			});
// 			marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
// 				offset: new AMap.Pixel(30,-8),//修改label相对于maker的位置
// 				content: pointName
// 			});	
// 			//点击标注的点调起高德地图
// 			marker.on('click',function(e){
// 				marker.markOnAMAP({
// 					name:pointName,
// 					position:marker.getPosition()
// 				})
// 			})
							
							
							
		},
		apply:function(e){
			var _this=this;
			if(String(e).indexOf(',')>0){
				e=String(e).split(',')[0];
			}
			if(String(e).indexOf(';')>0){
				e=String(e).split(';')[0];
			}
			return e;
		},
		// 点击拨打电话
		callP:function(p){
			var _this=this;
			_this.showZx=false
			_this.phoneMsg=p;
			var index=_this.phoneMsg.indexOf("\,");
			_this.phoneF=_this.phoneMsg.substring(0,index);
			_this.phoneL=_this.phoneMsg.substring(index+1,_this.phoneMsg.length);
			console.log(_this.phoneF);
			_this.callPhone=true;
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