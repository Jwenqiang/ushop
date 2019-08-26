document.write("<script language=javascript src='./js/main.js'></script>");
var lstorage=window.sessionStorage;
var storage=window.localStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		userInfo:{
			username:"",
			uCode:"",
			password:""
		},
		InvitationUserId:"",
		InvitationCompanyId: "",
		InvitationChannelId: "",	
		showF:false,
		fname:"",
		fimg:"",
		fxType:2,
		invCount:0,
		ymoney:0,
		dmoney:0,
		dataList:[],
		AllType:1,
		dataTotal:11,
		count:1,
		alltype:1,
		ewm:"",
		userHref:"",
		gnum:"",
		productList:[],
		bjImg:"",
		bjImgy:""
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
		getHouse:function(a){
			var _this=this;
			// 公共提交数据格式
			var useData={
				PageIndex: 1,
				PageSize: 4,
				Recommend:3,
			};
			axios({
				method:"post",
				url:"/Project/GetProjectPageList",
				data:JSON.stringify(useData),
			})
			.then(function(r){
				console.log(r);
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
		isM:function(){
			var _this=this;
				axios.get("/Users/GetInvitationUserRewardReg",{
					params:{
						UserId:_this.getUrlParam("UserId"),
						// InvitationUserId:userId,
						AllType:_this.alltype					
					}
				})
				.then(function(r){
					 //console.log(r);
					 _this.AllType=1;
					 if(r.data.code=='1001'){
						 _this.AllType=1;
						 _this.invCount=r.data.data.Count;
						 _this.ymoney=r.data.data.YesReward;
						 _this.dmoney=r.data.data.NoReward;
						 _this.dataList=r.data.data.InvitationUserRewardList.DataList;
						 if(_this.dataList==null){
							 _this.dataList=[];
						 }
						 _this.dataTotal=r.data.data.TotalRecord;
						 lstorage.setItem("afycontent",JSON.stringify(_this.dataList));
					 }else{
						 $.toast(r.data.message, "text");
					 }
				})	
				.catch(function(e){
					
				})	
			
		},
		getBj:function(a){
			var _this=this;
			axios.get("System/GetSystemConfigByKey")
			 .then(function(r){
				 console.log(r);
				 if(r.data.code=='1001'){
					_this.bjImg=r.data.data.FaceInvitationImg
					_this.bjImgy=r.data.data.AlreadyInvitationJoinImg
				 }else{
					 $.toast("服务器繁忙", "text");
				 }
			 })
		},		
		
yq:function(e){
	var _this=this;
	_this.alltype=e;
	axios.get("/Users/GetInvitationUserRewardReg",{
		params:{
			UserId:_this.getUrlParam("UserId"),
			// InvitationUserId:userId,
			AllType:_this.alltype					
		}
	})
	 .then(function(r){
		 //console.log(r);
		 _this.AllType=e;
		 if(r.data.code=='1001'){
			 _this.dataList=r.data.data.InvitationUserRewardList.DataList;
			 if(_this.dataList==null){
				 _this.dataList=[];
			 }			 
			_this.dataTotal=r.data.data.TotalRecord;
			lstorage.setItem("afycontent",JSON.stringify(_this.dataList));			 
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
				// window.location.href="./index.html";
				}
			 })					 
	 })	
},	
	noM:function(){
		var _this=this;
		_this.fxType=_this.getUrlParam("RegType");
		axios.get("Users/GetUserByInvitationUserId",{
			params:{
				InvitationUserIds:_this.getUrlParam("InvitationUserId")
			}
		})
		.then(function(r){
			console.log(r);
			if(r.data.data.FullName!=null&&r.data.data.FullName!=''){
				_this.fname=r.data.data.FullName;
			}else{
				_this.fname=r.data.data.Mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
			}
			console.log(_this.fname);
			_this.fimg=r.data.data.HeadImg;
			_this.bjImg=r.data.data.SystemConfigInvitationJoinImg
		})		
	},
		getData:function(a){
			var _this=this;
			_this.gnum=_this.guid();
			_this.fxType=_this.getUrlParam("RegType");
			if(_this.getUrlParam("RegType")){
				$("#loadingDiv1").fadeOut(300);	
			}
			_this.getBj();
			if(_this.fxType==2){
				_this.isM();
			}else{	
				_this.noM();
				_this.getHouse();
				// 微信授权
				var ua = navigator.userAgent.toLowerCase();
				var isWeixin = ua.indexOf('micromessenger') != -1;
				if(_this.getUrlParam("code")!=null&&_this.getUrlParam("state")!=null){
					return false;
				}else{
					if (isWeixin) {
						axios.get("/Wx/OAuth",{
							params:{
								JumpHtml:"account-fx.html",
								// Guid: _this.gnum,
								InvitationUserId:_this.getUrlParam("InvitationUserId"),
								InvitationCompanyId:_this.getUrlParam("InvitationCompanyId"),
								InvitationChannelId:_this.getUrlParam("InvitationChannelId"),
							}
						})
							.then(function(r){
								window.location.href=r.data;
							})
							.catch(function(e){
								//console.log('授权失败');
								
							})
						
					}
				}	
			}
		},
		goReg:function(){
			var _this=this;
			if(_this.userInfo.username==""){
				$.toast("手机号不能为空", "text");
				return false;
			}else if(!(/^1[345678]\d{9}$/.test(_this.userInfo.username))) {
				$.toast("号码输入有误", "cancel");
				return false;
			}else if(_this.userInfo.password==""){
				$.toast("密码不能为空", "text");
				return false;
			}
			else if(_this.userInfo.password.length>18||_this.userInfo.password.length<6){
				$.toast("密码输入有误", "cancel");
				return false;
			}
			else{
			var storage=window.localStorage;				
				if(_this.getUrlParam("code")!=null&&_this.getUrlParam("state")!=null){
					var useDada={
					  Mobile: _this.userInfo.username,
					InvitationUserId:_this.getUrlParam("InvitationUserId"),
					InvitationCompanyId:_this.getUrlParam("InvitationCompanyId"),
					InvitationChannelId:_this.getUrlParam("InvitationChannelId"),
					  VerificationCode: _this.userInfo.uCode,
					  Password: _this.userInfo.password,
					  // Guid: _this.gnum,
					  WeiXinCode: _this.getUrlParam("code"),
                        WeiXinState: _this.getUrlParam("state"),
                        WeiXinOpenId: _this.getUrlParam("OpenId")
					};					
				}else{
					var useDada={
					    Mobile: _this.userInfo.username,
						InvitationUserId:_this.getUrlParam("InvitationUserId"),
						InvitationCompanyId:_this.getUrlParam("InvitationCompanyId"),
						InvitationChannelId:_this.getUrlParam("InvitationChannelId"),
					    VerificationCode: _this.userInfo.uCode,
						Password: _this.userInfo.password,
                        WeiXinOpenId: _this.getUrlParam("OpenId")
					};
				}				
				axios({
					method:"post",
					url:"/Users/Register",
					data:JSON.stringify(useDada)
				})
				 .then(function(r){
					 //console.log(r);
					 //获取本地存储的用户信息
					 if(r.data.code=='1001'){
						 //console.log(r.data.data);
						 storage.setItem("userInfo",JSON.stringify(r.data.data));						 
						 // $.toast("注册成功", "success");
						 _this.showF=true;
					 }else{
						 $.toast(r.data.message, "cancel");
					 }
				 })
				 .catch(function(error){
					 //console.log(error);
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							}
						 })					 
				 })	
		 }
		},
		goIndex:function(){
			var _this=this;
			_this.show=!_this.show;
			window.location.href="index.html";
		},
		// 获取验证码
		sendCode:function(){
			var _this=this;
			if(!(/^1[345678]\d{9}$/.test(_this.userInfo.username))) {
				$.toast("号码输入有误", "cancel");
			}else{				
				var useCode={
					Mobile: _this.userInfo.username,
					type:1       //数字的含义：1 用户注册 2 修改密码 3 申请合作
				};
				axios({
					method:"post",
					url:"/Users/AddUserVerificationCode",
					data:JSON.stringify(useCode)
				})
				.then(function(r){
					_this.uCode=r.data.data.VerificationCode;//验证码值
					//console.log(r);
					//console.log(_this.uCode);
				})
				 .catch(function(error){
					 //console.log(error);
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
		
readMore:function(){
			var _this=this;
			_this.count++;
			if(storage.getItem("userInfo")){
				axios.get("/Users/GetInvitationUserRewardReg",{
					params:{
					UserId:_this.getUrlParam("UserId"),
					InvitationUserId:userId,
					AllType:_this.alltype					
					}
				})
				 .then(function(r){
					 //console.log(r);
					 if(r.data.code=='1001'){
						_this.dataTotal=r.data.data.TotalRecord;
						_this.dataList = (JSON.parse(lstorage.getItem("afycontent"))).concat(r.data.data.InvitationUserRewardList.DataList);//合并两个数组
						lstorage.setItem("afycontent",JSON.stringify(_this.dataList));
					 }else{
						 $.toast("服务器繁忙", "text");
					 }
				 })
				 .catch(function(error){
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function () {
							//点击确认
							// window.location.href="./index.html";
							}
						 })					 
				 })
			}	
},		
		
		// 截取浏览器地址id
		getUrlParam:function(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;			
		},	
		guid:function() {
		    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
		}		
	}
})