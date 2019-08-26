document.write("<script language=javascript src='./js/main.js'></script>");
var storage=window.localStorage;
if(storage.getItem("userInfo")){
	//console.log(JSON.parse(storage.getItem("userInfo")).Token);
	var token=JSON.parse(storage.getItem("userInfo")).Token; 
	var userId=JSON.parse(storage.getItem("userInfo")).UserId; 
// 验证令牌
axios.defaults.headers.common['token'] = token;	
}
var lstorage=window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		UserId:"",
		userInfoList:[],
		on:'',
		CustomerList:[],
// 			Mobile:[],
// 			FullName:[],
// 			Gender:[],
		ProjectList:[],
			// ProjectId:"",
		CompanyUserId:"",
		CompanyId:"",
		VisitTime:"",
		CustomerDemand:"",
		ReportSourceType:"",
		// 购房意向条件
		show:false,
		RegionList:"",//区域
		Apartment:"",//户型
		Measure:"",//面积
		Total :"",//总价
		Property:"",//物业类别
		selectAll:[],//选中的所有条件
		selectOther:"",
		selectedProjectList:"",//获取所有的盘源报备属性
		selectedProject:[],//需要提交的盘源ID
		yes:true
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
		this.getProduct();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted() { //下面表示已执行方法  编译好html后在这操作
	},
	methods:{
		getData:function(a){
			var _this=this;
			if(storage.getItem("userInfo")){
				if(lstorage.getItem('atime')!=null){
					_this.VisitTime=lstorage.getItem('atime');
				}				
				_this.UserId=JSON.parse(storage.getItem("userInfo")).UserId;
				axios.get("/Attribute/GetAttributeList",{
					params:{
						AttributeType: 0,
						RegionId:233
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						 _this.RegionList=r.data.data.RegionList;
						 _this.Apartment=r.data.data.Apartment.AttributeValueList;
						 //console.log(_this.Apartment);
						 _this.Measure=r.data.data.Measure.AttributeValueList;
						 _this.Total=r.data.data.Total.AttributeValueList;
						 _this.Property=r.data.data.Property.AttributeValueList;
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
		getProduct:function(){
			var _this=this;
			if(lstorage.getItem("selectedProduct")){
				_this.selectedProjectList=JSON.parse(lstorage.getItem("selectedProduct"));
				_this.selectedProjectList.forEach(function(val){
					var obj={};
					obj.ProjectId=val.ProjectId;
					obj.ReceiveUserId=val.ReceiveUserId;
					_this.selectedProject.push(obj);
				})
				//console.log(_this.selectedProject);
			}
		},
addList:function(){
	var _this=this;
	_this.userInfoList.push({FullName:'',Mobile:'',Gender:''})
},
minusList:function(index){
	var _this=this;
	_this.userInfoList.splice(index, 1);
},
//删除盘源
minusProduct:function(index){
	var _this=this;
	_this.selectedProjectList.splice(index, 1);
	lstorage.setItem("selectedProduct",JSON.stringify(_this.selectedProjectList));
	_this.getProduct();
},

		goReport:function(){
			var _this=this;
			$.showLoading("报备中");
			//console.log(_this.userInfoList)
			if(storage.getItem("userInfo")){
				_this.CompanyUserId=JSON.parse(storage.getItem("userInfo")).UserId; 
				_this.CompanyId=JSON.parse(storage.getItem("userInfo")).CompanyId; 
				if(lstorage.getItem('atime')!=null){
					_this.VisitTime=lstorage.getItem('atime');
				}
				if(_this.selectedProject==''){
					$.hideLoading();
					$.toast("请选择盘源", "cancel");
				}
				else if(_this.userInfoList==''){
					$.hideLoading();
					$.toast("至少一个客户", "cancel");
				}				
				else if(_this.VisitTime==''){
					$.hideLoading();
					$.toast("到访时间必选", "cancel");
				}
				else{
// 数组对象校验号码是否重复
					var result = [];
					var obj = {};
					for(var i =0; i<_this.userInfoList.length; i++){
						if(_this.userInfoList[i].FullName==''){
							$.hideLoading();
							$.toast("客户姓名必填", "cancel");
							return false;
						}
						else if(!(/^1[345678]\d{9}$/.test(_this.userInfoList[i].Mobile))){
							$.hideLoading();
							$.toast("号码填写有误", "cancel");
							return false;
						}
						else if(_this.userInfoList[i].Gender==''){
							$.hideLoading();
							$.toast("客户性别必选", "cancel");
							return false;
						}
						else{
						   if(!obj[_this.userInfoList[i].Mobile]){
							  result.push(_this.userInfoList[i]);
							  obj[_this.userInfoList[i].Mobile] = true;
						   }else{
							   $.hideLoading();
								$.toast("号码不能重复", "cancel");
								return false;
							}
						}	
				   }
					var useDada={
						CustomerList:_this.userInfoList,
						ProjectList:_this.selectedProject,
						CompanyUserId:_this.CompanyUserId,
						CompanyId:_this.CompanyId,
						VisitTime:_this.VisitTime,
						CustomerDemand:_this.CustomerDemand,
						ReportSourceType:3					
					};
					//console.log(useDada);
					axios({
						method:"post",
						url:"/Customer/Report",
						data:JSON.stringify(useDada)
					})
					.then(function(r){
						// 报备信息提交成功执行操作
						//console.log(r);
						if(r.data.code=="1001"){
							$.hideLoading();
							sessionStorage.clear();
							//console.log(r);
							$.toast("报备成功","success");
							setTimeout(function(){
								lstorage.removeItem("atime");
								lstorage.removeItem("selectedProduct");
								window.location.href="bb-ybb.html";
							},500)					
						}else{
							$.toast(r.data.message,"text");
						}

					})
					.catch(function(e){
						window.location.href="login.html";					
					})
				}
			}else{
				 window.location.href="./login.html";
			}				
		},
		arrQc:function(arr){
			//  方法1：利用对象访问属性的方法，判断对象中是否存在Mobile
			var result = [];
			var obj = {};
			for(var i =0; i<arr.length; i++){
			   if(!obj[arr[i].Mobile]){
				  result.push(arr[i]);
				  obj[arr[i].Mobile] = true;
			   }
		   }
			return result;
					   //console.log(result);
		},
		// 选择购房意向的条件
		selectMsg:function(){
			var _this=this;
			_this.show=false;
			if(_this.selectAll.length>0){
				if(_this.selectOther!=''){
					_this.CustomerDemand=_this.selectAll+','+_this.selectOther;
				}else{
					_this.CustomerDemand=_this.selectAll
				}
			}else{
				if(_this.selectOther!=''){
					_this.CustomerDemand=_this.selectOther;
				}			
			}
			if(lstorage.getItem('atime')!=null){
				_this.VisitTime=lstorage.getItem('atime');
			}			
		},
		
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;	
		},
 },
})