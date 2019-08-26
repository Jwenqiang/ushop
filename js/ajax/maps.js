document.write("<script language=javascript src='./js/main.js'></script>");
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.map-box', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		Xpoint:"",
		Ypoint:""
		
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
			if(this.getUrlParam('from')){
				window.location.href="https://hfugweb.centaline.com.cn/house_info.html?id="+this.getUrlParam('hid')+"&from=other";
			}			
			var _this=this;
			_this.Xpoint=_this.getUrlParam("x");
			_this.Ypoint=_this.getUrlParam("y");
			// 公共提交数据格式
			if(_this.Xpoint!=null&&_this.Xpoint!=null){
				lstorage.setItem("x",_this.Xpoint);
				lstorage.setItem("y",_this.Ypoint);
			}else{
				window.location.href="index.html";
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