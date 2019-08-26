document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	//console.log(JSON.parse(storage.getItem("userInfo")).Token);
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		helpContent:"",
		PicImgList:[],
		imgsrc:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.jugeLogin();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	updated:function(){
		// wxShared();	
	},	
	methods:{
		jugeLogin:function(){
			if(!storage.getItem("userInfo")){
				window.location.href="./login.html";
			}
		},
		getData:function(){
			var _this=this;
			if(storage.getItem("userInfo")){
				var useData={
					UserId:_this.getUrlParam("id"),
					Content:_this.helpContent,
					PicImgList:_this.PicImgList
				};
				axios({
					method:"post",
					url:"/FeedbackMsg/AddFeedbackMsg",
					data:JSON.stringify(useData)
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 $.toast("反馈成功", "success");
						 window.location.href="account-help.html";
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

    //上传图片转为base64格式
    uploadImg:function(e){
		var _this=this;
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
			$.alert({
				title: '图片格式错误',
				text: '图片类型必须是.gif,jpeg,jpg,png,bmp中的一种~',
				onOK: function () {
				}
			 })				
            return false
        }
		//console.log(_this.PicImgList);
	if(_this.PicImgList.length<3){		
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
			$.showLoading("图片上传中");
            _this.imgsrc= e.target.result
            // //console.log("图片地址" + e.target.result)
            //提交到后台相关略
			//console.log(_this.imgsrc);
			var useData={
				ImgBase64:_this.imgsrc,
				Type:2
			}
				axios({
					method:"post",
					url:"/System/PostImgByBase64",
					data:JSON.stringify(useData)
				})
				.then(function(r){
					if(r.data.code='1001'){
						$.hideLoading();
						_this.PicImgList.push(r.data.message);
					}else{
						$.toast("图片上传失败","text");
					}
				})
        }
	}else{
		$.toast("最多三张图片","text");
    }
	},
	removeImg:function(index){
		var _this=this;
		_this.PicImgList.splice(index,1);
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