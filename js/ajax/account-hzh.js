document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		helpInfo:"",
		userL:false,
		UserId:"",
		dataTotal:11,
		count:1		
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
			var _this=this;
			// 如果是已登陆用户
			if(storage.getItem("userInfo")){
				_this.userL=true;
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
			}
            axios.get("/Help/GetHelps",{
                params: {
                    ArticleCategoryId: _this.getUrlParam('ArticleCategoryId')
                }
            })
			 .then(function(r){
				 //console.log(r);
				 if(r.data.code=='1001'){
					 _this.helpInfo=r.data.data.DataList;
					lstorage.setItem("ahcontent",JSON.stringify(_this.helpInfo));					 
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
readMore:function(){
			var _this=this;
			_this.count++;
			// 如果是已登陆用户
			if(storage.getItem("userInfo")){
				_this.userL=true;
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
			}
			axios.get("/Help/GetHelps",{
                params: {
                    ArticleCategoryId: _this.getUrlParam('ArticleCategoryId'),
					PageIndex:_this.count
				}
			})
			 .then(function(r){
				 //console.log(r);
				 if(r.data.code=='1001'){
					 _this.dataTotal=r.data.data.TotalRecord;
					_this.helpInfo = (JSON.parse(lstorage.getItem("ahcontent"))).concat(r.data.data.DataList);//合并两个数组
					lstorage.setItem("ahcontent",JSON.stringify(_this.helpInfo));					 
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
        },
        // 截取浏览器地址id
        getUrlParam: function (name) {
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
	}
})