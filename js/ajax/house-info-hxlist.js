document.write("<script language=javascript src='./js/main.js'></script>");
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		houseType:[],
		hid:"",
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
// 			if(this.getUrlParam('from')){
// 				window.location.href="http://hfugweb.centaline.com.cn/house_info.html?id="+this.getUrlParam('id')+"&from=other";
// 			}				
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
						_this.hid=r.data.data.Id;
						_this.houseType=r.data.data.Estate.PropertyRoomTypeList;
							//console.log(_this.houseType);
					}else{
						$.toast(r.data.message, "text");
					}
				})
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试5~"',
							onOK: function () {
							// window.location.href="./index.html";
							}
						 })					 
				 })	
			}else{
				window.location.href="./index.html";
			}
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