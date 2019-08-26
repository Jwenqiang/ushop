document.write("<script language=javascript src='./js/wx.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		xzMsg:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	updated:function(){

	},	
	methods:{
		getData:function(a){
			$.showLoading("");
			var _this=this;
			if(storage.getItem("userInfo")){
				axios({
					method:"post",
					url:"Activity/AddEnrollUserLog",
					data:JSON.stringify({
						EnrollId:_this.getUrlParam("id"),
						Remarks:_this.xzMsg						
					}),
				})				
				 .then(function(r){
					 console.log(r);
					 if(r.data.code=='1001'){
						 $.hideLoading("");
						$.toast("添加成功", "success");		
						setTimeout(function() {
							window.history.go(-1);	
						}, 500);				 
						

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
			 }else{
				 window.location.href="./login.html";
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