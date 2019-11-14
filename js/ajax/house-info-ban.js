
// 验证令牌
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		allType:"",
		picType:[],
		imgList:[],
		current:0,
		imgArr:[]
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function() { //创建实例el后
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
		getData:function(index){
			var _this=this;
			if(index==undefined){
				index=0;
			}
			axios.get("/Estate/GetEstateByEstateId",{
				params:{
					EstateId:_this.getUrlParam('id')
				}
			})
			 .then(function(r){
				 if(r.data.code=='1001'){
					 _this.picType=r.data.data;
					 _this.imgList=r.data.data[index].PhotoList;
					 for(var i in _this.imgList){
						 _this.imgArr.push(_this.imgList[i].FilePath);
					 }
						// DOM还没有更新
						_this.$nextTick(() => {
							// DOM更新了
							// swiper重新初始化
							/* eslint-disable no-new */
							_this.slide0();
							_this.slide1();
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
						window.location.href="index.html";
					  }
				   })					 
			 })
		},
		selectPic:function(t){
			var _this=this;
			_this.current=t;
			_this.getData(t);
		},
		slide0:function(){
			var mySwiper = new Swiper('.swiper-container',{  
				// loop:true,
				//一屏4.5个
				slidesPerView : 4.2,
				//每个的距离
				// spaceBetween : 10,  	
				//滑动是整个
					freeMode: false, 
			}) 		
		},
		slide1:function(){
			var mySwiper1 = new Swiper('.swiper-container1',{  
				loop:true,
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				  },
				 // 分页计数错误时加下面代码
				observer:true,//修改swiper自己或子元素时，自动初始化swiper 
				observeParents:false,//修改swiper的父元素时，自动初始化swiper 
				onSlideChangeEnd: function(swiper){ 
				　　　swiper.update();  
				　　　mySwiper.startAutoplay();
				　　   mySwiper.reLoop();  
				}								   
			}) 	
		},		

		imgChange(e){
			wx.previewImage({
			  current: e, // 当前显示图片的http链接
			  urls: this.imgArr // 需要预览的图片http链接列表
			}) 			
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