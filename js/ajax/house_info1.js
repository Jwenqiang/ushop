document.write("<script type='text/javascript' src='./js/main.js'></script>");
	
var lstorage=window.sessionStorage;
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
		if(this.Xpoint!=''&&this.Xpoint!=null){
			this.getMap();
		}
		$("#loadingDiv1").fadeOut(300);	
	},	
	methods:{		
		getData:function(a){
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
					console.log(r);
					if(r.data.code=='1001'){
						_this.product=r.data.data;
						_this.htitle=r.data.data.ProjectName;
						$('title').html(_this.htitle+"-楼盘详情");
						_this.imgBan=r.data.data.Estate.EstatePhotosAllList;
						//console.log(_this.imgBan);
						_this.houseJd=r.data.data.Information;
						_this.mainInfo=r.data.data.Estate;
						_this.roll=r.data.data.Coupon;
                        _this.houseType = r.data.data.Estate.PropertyRoomTypeList;
						//console.log(_this.houseType);
						_this.services=r.data.data.ProjectAdviserList;
						_this.price=r.data.data.Aprice;
						if(r.data.data.Estate.XPoint!=null&&r.data.data.Estate.YPoint!=null){
							_this.Xpoint=r.data.data.Estate.XPoint;
							_this.Ypoint=r.data.data.Estate.YPoint;
							lstorage.setItem('pointName',r.data.data.ProjectName);
							lstorage.setItem('x',_this.Xpoint);
							lstorage.setItem('y',_this.Ypoint);
						}else if(_this.product.Id==1070){
								_this.Xpoint=114.25304;
								_this.Ypoint=22.579448;
								lstorage.setItem('pointName',r.data.data.ProjectName);
								lstorage.setItem('x',_this.Xpoint);
								lstorage.setItem('y',_this.Ypoint);						
						}
						// DOM还没有更新
						_this.$nextTick(() => {
							// DOM更新了
							// swiper重新初始化
							/* eslint-disable no-new */
							_this.slide0();
							_this.slide1();
						})						
						_this.getProduct();
						
					}else{
						$("#loadingDiv1").fadeOut(300);	
						$.toast("该楼盘已下架", "text");
						setTimeout(function(){
							window.location.href="house-list.html";
						},500)
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
				window.location.href="./index.html";
			}
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
			var map = new AMap.Map("container", {
				resizeEnable: true,
				zoom: 15,
				//显示的地图中心点
				center: [x, y]
			});
		
			//添加点标记，并使用自己的icon
			var marker = new AMap.Marker({
				map: map,
				//需要标记的地图中心点
				position: [x, y],
				icon: new AMap.Icon({
					size: new AMap.Size(24, 31), //图标大小
					image: "img/mark2.png",
				}),
			});
			marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
				offset: new AMap.Pixel(30,-8),//修改label相对于maker的位置
				content: pointName
			});	
			//点击标注的点调起高德地图
			marker.on('click',function(e){
				marker.markOnAMAP({
					name:pointName,
					position:marker.getPosition()
				})
			})				
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
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},
	}
})