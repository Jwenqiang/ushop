var lstorage=window.sessionStorage;
var storage=window.localStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		productList:"",
		hotList:"",
		show:"",
		userRole:"",
		searchMsg:"",
		showSearch: false,
		isShare:false,
		SourceUserId:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		if(storage.getItem("userInfo")){
			this.SourceUserId=JSON.parse(storage.getItem("userInfo")).UserId;
		}	
		this.getData();
		this.getHot('projectscore');
		if(this.getUrlParam('from')){
			this.isShare=true;
		}	
 // 微信分享数据
		Sstorage.setItem("urlf",window.location.href);			
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

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
	methods:{				
		getData:function(a){
			 // 微信分享数据
			Sstorage.setItem("urlf",window.location.href);
			Sstorage.setItem("bt","好房U购精选新房");
			Sstorage.setItem("tp","https://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg");
			Sstorage.setItem("ms","海量精选房源，品牌开发商，超大优惠力度，全流程贵宾式服务，购房也能省好多钱！");	
						
			var _this=this;
			if(_this.getUrlParam('x')==1){
				$('#footer').addClass("fixedX");
			}			
			if(storage.getItem("userInfo")){
				_this.userRole=JSON.parse(storage.getItem("userInfo")).RoleType;
			}
			// 公共提交数据格式
			var useData={
				PageIndex: 1,
				PageSize: 10,
				Recommend:2,
			};
			axios({
				method:"post",
				url:"/Project/GetProjectPageList",
				data:JSON.stringify(useData),
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
		// 获取评分、人气榜
		getHot:function(name,index){
			var _this=this;
			_this.show=name;
			if(name=='rx'){
				// 公共提交数据格式
				var useData={
					PageIndex: 1,
					PageSize: 10,
					Recommend:1,
				};
				axios({
					method:"post",
					url:"/Project/GetProjectPageList",
					data:JSON.stringify(useData),
				})
				.then(function(r){
					//console.log(r);
						if(r.data.code=='1001'){
							_this.hotList=r.data.data.ProjectList.DataList;
						}else{
							$.toast("服务器繁忙", "text");
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
				// 公共提交数据格式
				var useData={
					PageIndex: 1,
					PageSize: 10,
					Order:name,
					OrderBy:'desc',
				};
				axios({
					method:"post",
					url:"/Project/GetProjectPageList",
					data:JSON.stringify(useData),
				})
				.then(function(r){
					//console.log(r);
					if(r.data.code=='1001'){
						_this.hotList=r.data.data.ProjectList.DataList;
					}else{
						$.toast("服务器繁忙", "text");
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
			}
		},
		apply:function(e){
			var _this=this;
			if(e.indexOf(',')>0){
				e=String(e).split(',')[0];
				//console.log(e);
			}
			if(e.indexOf(';')>0){
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
				window.location.href="house-list.html?ym=buy_house.html";
			}
		}					
	}
})