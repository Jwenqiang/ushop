document.write("<script language=javascript src='./js/main.js'></script>");
// 验证令牌
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		allType:"",
		picType:[],
		imgList:[],
		bigImg:"",
		showBig:false
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
		getData:function(){
// 			if(this.getUrlParam('from')=='singlemessage'){
// 				window.location.href="http://hfugweb.centaline.com.cn/house_info.html?id="+this.getUrlParam('hid')+"&from=other";
// 			}				
			var _this=this;
			axios.get("/Estate/GetPropertyRoomTypeByRoomTypeID",{
				params:{
					RoomTypeID:_this.getUrlParam('id')
				}
			})
			 .then(function(r){
				 if(r.data.code=='1001'){
					 //console.log(r);
					 _this.picType=r.data.data;
					 // //console.log(_this.imgList);
						// DOM还没有更新
						_this.$nextTick(() => {
							// DOM更新了
							// swiper重新初始化
							_this.slide0();
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
		slide0:function(){
			var mySwiper1 = new Swiper('.swiper-container1',{  
				loop:true,
				pagination: {
						el: '.swiper-pagination',
						type: 'fraction',
				 },	
			}) 		
		},	
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
		bigBan:function(imgUrl){
			var _this=this;
			_this.bigImg=imgUrl;
			_this.showBig=true;
		},		
	}
})