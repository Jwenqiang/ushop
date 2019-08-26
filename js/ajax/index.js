var storage=window.localStorage;
if(storage.getItem("userInfo")){
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var lstorage=window.sessionStorage;

// 验证令牌
// axios.defaults.headers.common['Authorization'] = "AUTH_TOKEN";
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		SourceUserId:"",
		SourceUserTel:"",
		imgArr: [], //banner
		szhq: "", //行情
		activeArr: "", //最新活动
		house_hot: "", //热销好盘
		house_new: "", //新盘入市
		house_zx: "", //楼市资讯
		userRole:"",//角色权限
		dataTotal:11,
		count:1,
		alltype:1,
		searchMsg:"",
		showSearch: false,
		isShare:false,
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		if(storage.getItem("userInfo")){
			this.SourceUserId=JSON.parse(storage.getItem("userInfo")).UserId;
			this.SourceUserTel=JSON.parse(storage.getItem("userInfo")).TelePhone;
		}	
		this.getData();
		this.zx(1);
		function bodyScroll(event){  
			event.preventDefault();  
		}
		if(this.getUrlParam('from')){
			this.isShare=true;
		}
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作
		
	},
	beforeUpdate:function(){
	},
	updated:function(){
		$("#loadingDiv1").fadeOut(300);
			var href = window.location.href;
			href = href.substring(href.lastIndexOf("/") + 1);
			if (Sstorage.getItem(href)) {
				$(".whole").scrollTop(Number(Sstorage.getItem(href)));
			}
		// wxShared();		
	},
	beforeDestroy:function(){
	},
	destoryed:function(){
		
	},
	methods: {
		getData: function() {
			 // 微信分享数据
			Sstorage.setItem("urlf",window.location.href);
			Sstorage.setItem("bt","好房U购让购房更省心更优惠！");
			Sstorage.setItem("tp","https://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg");
			Sstorage.setItem("ms","最全⼀⼿房源，五大购房福利，合作企业员工享受优惠折上折，品质生活从买到好房子开始！");		
			var _this=this;
			if(_this.getUrlParam('x')==1){
				$('#footer').addClass("fixedX");
			}
			if(storage.getItem("userInfo")){
				_this.userRole=JSON.parse(storage.getItem("userInfo")).RoleType;
			}
			var _this = this; //指el vue实列
			//首页banner图 
			axios.get("/System/GetBanner")
				.then(function(response) {
					_this.imgArr = response.data.data.Item;
					// DOM还没有更新
					_this.$nextTick(() => {
						// DOM更新了
						// swiper重新初始化
						/* eslint-disable no-new */
						_this.slide();
					})
				})
				.catch(function(e) {

				})
			//首页行情数据
			axios.get("/System/GetHousePricedataByRegionId",{
				params:{
					RegionId:233
				}
			})
				.then(function(r) {
					//console.log(r);
					_this.szhq = r.data.data;
				})
			//最新活动
			axios.get("/Activity/GetActivityPageList")
				.then(function(r) {
					_this.activeArr = r.data.data.DataList;
					// DOM还没有更新
					_this.$nextTick(() => {
						// DOM更新了
						// swiper重新初始化
						/* eslint-disable no-new */
						_this.slide1();
					})
				})
			//热销好盘、新盘入市
			axios.get("/ProjectRecommend/GetProjectRecommendPageList")
				.then(function(r) {
					_this.house_hot = r.data.data.HotSale;//热销好盘
					_this.house_new = r.data.data.NewPlate;//新盘入市
					// DOM还没有更新
					_this.$nextTick(() => {
						// DOM更新了
						// swiper重新初始化
						_this.slide2();
					})
				})
			//楼市热点、楼盘解读
			axios.get("/Information/GetInformationPageList",{
				params:{
					pageSize:5
				}
			})
				.then(function(r) {
					//console.log(r);
					_this.house_zx = r.data.data.DataList;
					_this.dataTotal=r.data.data.TotalRecord;
					//console.log(_this.house_zx.length);
					lstorage.setItem("zcontent",JSON.stringify(_this.house_zx));
				})

		},

// 滑动插件swiper参数定义

		slide: function() {
			var mySwiper = new Swiper('.swiper-container', {
				autoplay: {
					delay: 6000,
					disableOnInteraction: false,
				},
				loop: true,
				//手滑动切换后恢复自动
				disableOnInteraction: false,
				// 如果需要分页器
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
					clickableClass: 'my-pagination-clickable',
				},
				paginationClickable: true,
			})
		},
		slide1: function() {
			var mySwiper1 = new Swiper('.swiper-container1', {			
				loop: true,
				slidesPerView: 2.5,
				// 小数循环
				loopedSlides: 10,				
				//一屏2.5个
				// slidesPerView: 2.5,
				//每个的距离
				spaceBetween: 12,
				//滑动是整个
				freeMode: false,
				//  freeModeFluid: true,
				//是否有拖动惯性
				freeModeMomentum: true,
			})
		},
		slide2: function() {
				var mySwiper2 = new Swiper('.swiper-container2', {
					//一屏2.5个
					slidesPerView: 1.8,
					//每个的距离
					spaceBetween: 12,
					freeMode: true,
					freeModeFluid: true,
					//是否有拖动惯性
					freeModeMomentum: true,
				})
		},	
			// 底部资讯点击切换
		zx: function(e) {
			var _this = this; //指el vue实列
			_this.alltype=e,
			//楼市热点、楼盘解读
			axios.get("/Information/GetInformationPageList",{
				params:{
					Type:_this.alltype
				}
			})
				.then(function(r) {
					_this.house_zx = r.data.data.DataList;
					_this.dataTotal=r.data.data.TotalRecord;
					lstorage.setItem("zcontent",JSON.stringify(_this.house_zx));
				})
		},
		
		readMore:function(){
			var _this=this;
			_this.count++;
			//楼市热点、楼盘解读
			axios.get("/Information/GetInformationPageList",{
				params:{
					PageIndex:_this.count,
					Type:_this.alltype
				}
			})
				.then(function(r) {
					_this.dataTotal=r.data.data.TotalRecord;
					_this.house_zx = (JSON.parse(lstorage.getItem("zcontent"))).concat(r.data.data.DataList);//合并两个数组
					lstorage.setItem("zcontent",JSON.stringify(_this.house_zx));
				})
		},
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
		// 搜索栏搜索
		goSearch:function(){
			var _this=this;
			_this.showSearch=true;
			document.getElementById("s-search").focus();
		},
		noSearch:function(){
			var _this=this;
			_this.showSearch=false;			
		},
		goList:function(){
			var _this=this;
			if(_this.searchMsg!=''){
				lstorage.setItem("msg",_this.searchMsg);
				window.location.href="house-list.html?ym=index.html";
			}
		}
	}
});
