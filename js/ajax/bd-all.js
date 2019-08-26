document.write("<script language=javascript src='./js/main.js'></script>");
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		productList:"",
		hotList:"",
		show:"",
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getHot('projectscore');
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作

	},
	methods:{				
		// 获取评分、人气榜
		getHot:function(name,index){
			var _this=this;
			_this.show=name;
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
		},
	}
})