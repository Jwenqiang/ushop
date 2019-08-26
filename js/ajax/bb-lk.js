document.write("<script language=javascript src='./js/main.js'></script>");
var storage = window.localStorage;
if (storage.getItem("userInfo")) {
	//console.log(JSON.parse(storage.getItem("userInfo")).Token);
	var token = JSON.parse(storage.getItem("userInfo")).Token;
	var userId = JSON.parse(storage.getItem("userInfo")).UserId;
	// 验证令牌
	axios.defaults.headers.common['token'] = token;
}
var lstorage = window.sessionStorage;
var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '.whole', // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
	data: { // data: 是Vue对象中绑定的数据
		UserId: "",
		bblk: "",
		bblkType: "",
		bblkName: "",
		bblkProject: "",
		projectList:[],
		dqk: "",
		yxbb: "",
		yxdf: "",
		yrg: "",
		yqy: "",
		yjy: "",
		ysx: "",
		dataTotal: 11,
		count: 1,
		alltype: "",
		py:"全部盘源",
		zt:""
	},
	beforeCreate: function() { //创建实例el前

	},
	created: function(e) { //创建实例el后
		this.getData();
		this.getPro();
	},
	beforeMount: function() { //下面表示已执行方法  虚拟dom还没有内容

	},
	mounted: function() { //下面表示已执行方法  编译好html后在这操作
	},
	methods: {
		getData: function(a) {
			var _this = this;
			//console.log(_this.dqk);
			if (storage.getItem("userInfo")) {
				_this.UserId = JSON.parse(storage.getItem("userInfo")).UserId;
				if (a == undefined) {
					_this.bblkType = _this.getUrlParam("ApiStatus");
				} else {
					_this.bblkType = a;
				}
				if (_this.bblkType == '1') {
					_this.bblkName = '待确客'
				}
				if (_this.bblkType == '10') {
					_this.bblkName = '有效报备'
				}
				if (_this.bblkType == '25') {
					_this.bblkName = '有效到访'
				}
				if (_this.bblkType == '40') {
					_this.bblkName = '已认购'
				}
				if (_this.bblkType == '50') {
					_this.bblkName = '已签约'
				}
				if (_this.bblkType == '60') {
					_this.bblkName = '已结佣'
				}
				if (_this.bblkType == '4,15,30,45,55') {
					_this.bblkName = '已失效'
				}

// 获取盘源
				var useData = {
					ReceiveUserId: _this.UserId,
					ReportSourceType: 3,
					ApiStatus: _this.bblkType
				};
				axios({
						method: "post",
						url: "/Customer/GetReport",
						data: JSON.stringify(useData)
					})
					.then(function(r) {
						_this.getNum();
						//console.log(r);
						if (r.data.code == '1001') {
							_this.bblk = r.data.data.DataList;
							_this.dataTotal = r.data.data.TotalRecord;
							lstorage.setItem("blcontent", JSON.stringify(_this.bblk));
						} else {
							$.toast(r.data.message, "text");
						}
					})
					.catch(function(error) {
						window.location.href = "login.html";
// 						$.alert({
// 							title: '服务器错误',
// 							text: '"很抱歉，服务器出现错误，请稍后再试~"',
// 							onOK: function() {
// 								// window.location.href="./index.html";
// 							}
// 						})
					})
			} else {
				window.location.href = "./login.html";
			}
		},
		getPro: function() {
			var _this = this;
// 获取盘源下拉
			if (storage.getItem("userInfo")) {
				axios.get("/Customer/GetReportProject")
					.then(function(r) {
						//console.log(r);
						if (r.data.code == '1001') {
							_this.projectList = r.data.data;
						} else {
							$.toast("服务器繁忙", "text");
						}
					})
					.catch(function(error) {
						// _this.getNum();
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function() {
								// window.location.href="./index.html";
							}
						})
					})
			} else {
				window.location.href = "./login.html";
			}
		},
		selectL: function() {
			var _this = this;
			if (storage.getItem("userInfo")) {
				_this.UserId = JSON.parse(storage.getItem("userInfo")).UserId;

				if (_this.bblkName == '待确客') {
					_this.bblkType = '1'
				}
				if (_this.bblkName == '有效报备') {
					_this.bblkType = '10'
				}
				if (_this.bblkName == '有效到访') {
					_this.bblkType = '25'
				}
				if (_this.bblkName == '已认购') {
					_this.bblkType = '40'
				}
				if (_this.bblkName == '已签约') {
					_this.bblkType = '50'
				}
				if (_this.bblkName == '已结佣') {
					_this.bblkType = '60'
				}
				if (_this.bblkName == '已失效') {
					_this.bblkType = '4,15,30,45,55'
				}

				var useData = {
					ReceiveUserId: _this.UserId,
					ReportSourceType: 3,
					ApiStatus: _this.bblkType,
					ProjectId: _this.bblkProject
				};
				axios({
						method: "post",
						url: "/Customer/GetReport",
						data: JSON.stringify(useData)
					})
					.then(function(r) {
						//console.log(r);
						//console.log(_this.bblkName);
						if (r.data.code == '1001') {
							_this.bblk = r.data.data.DataList;
							_this.dataTotal = r.data.data.TotalRecord;
							lstorage.setItem("blcontent", JSON.stringify(_this.bblk));
						} else {
							$.toast("服务器繁忙", "text");
						}
					})
					.catch(function(error) {
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function() {
								// window.location.href="./index.html";
							}
						})
					})
			} else {
				window.location.href = "./login.html";
			}
		},
		// 获取数量
		getNum: function() {
			var _this = this;
			if (storage.getItem("userInfo")) {
				_this.UserId = JSON.parse(storage.getItem("userInfo")).UserId;
				_this.RoleType = JSON.parse(storage.getItem("userInfo")).RoleType;
				if (_this.RoleType == "3" || _this.RoleType == "4") {
					var useData = {
						ReportSourceType: 3,
						ReceiveUserId: JSON.parse(storage.getItem("userInfo")).UserId,
					};
				} else {
					var useData = {
						ReportSourceType: 3,
						CompanyUserId: JSON.parse(storage.getItem("userInfo")).UserId,
						CompanyId: JSON.parse(storage.getItem("userInfo")).CompanyId,
					};
				}
				axios({
						method: "post",
						url: "/Customer/GetReportStatisticsNumber",
						data: JSON.stringify(useData)
					})
					.then(function(r) {
						//console.log(r);
						if (r.data.code == '1001') {
							_this.dqk = r.data.data.StayConfirmed;
							_this.yxbb = r.data.data.ReportEffective;
							_this.yxdf = r.data.data.ReachEffective;
							_this.yrg = r.data.data.Subscription;
							_this.yqy = r.data.data.SignContract;
							_this.yjy = r.data.data.Maid;
							_this.ysx = r.data.data.AlreadyInvalid;
						} else {
							$.toast("服务器繁忙", "text");
						}
					})
					.catch(function(error) {
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function() {
								// window.location.href="./index.html";
							}
						})
					})
			} else {
				window.location.href = "./login.html";
			}
		},
		// 改变状态
		changeStatus: function(Id, Status, n, str) {
			var _this = this;
			var useData = {
				ReceiveUserId: _this.UserId,
				OldStatus: Status,
				Status: n,
				Id: Id,
			};
			if (Status == '40'&&n=='55') {
				$.prompt("确认已弃购？", function(text) {
					//点击确认后的回调函数
					//text 是用户输入的内容
					var useData1 = {
						ReceiveUserId: _this.UserId,
						OldStatus: Status,
						Status: n,
						Id: Id,
						Remarks: text
					};
					//console.log(useData1);
					axios({
						method:"post",
						url:"/Customer/UpdateReportStatus",
						data:JSON.stringify(useData1)
					})
					.then(function(r){
						//console.log(r);
						if(r.data.code='1001'){
							$.toast("修改成功","success");
							_this.getData();
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
				}, function() {
					//点击取消后的回调函数
				});
			}else {
				$.confirm({
					title: '',
					text: str,
					onOK: function() {
						//点击确认	
						axios({
								method: "post",
								url: "/Customer/UpdateReportStatus",
								data: JSON.stringify(useData)
							})
							.then(function(r) {
								//console.log(r);
								if (r.data.code = '1001') {
									$.toast("修改成功", "success");
									_this.getData(Status);
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
				})
			}
		},
		// 选择盘源
		selectP: function() {
			var _this=this;
			_this.py=_this.bblkProject;
			//console.log(_this.bblkProject);
			if (storage.getItem("userInfo")) {
				_this.UserId = JSON.parse(storage.getItem("userInfo")).UserId;
				var useData = {
					ReceiveUserId: _this.UserId,
					ReportSourceType: 3,
					ApiStatus: _this.bblkType,
					ProjectId: _this.bblkProject
				};
				axios({
						method: "post",
						url: "/Customer/GetReport",
						data: JSON.stringify(useData)
					})
					.then(function(r) {
						//console.log(r);
						//console.log(_this.bblkName);
						if (r.data.code == '1001') {
							_this.bblk = r.data.data.DataList;
							_this.dataTotal = r.data.data.TotalRecord;
							lstorage.setItem("blcontent", JSON.stringify(_this.bblk));
						} else {
							$.toast("服务器繁忙", "text");
						}
					})
					.catch(function(error) {
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function() {
								// window.location.href="./index.html";
							}
						})
					})
			} else {
				window.location.href = "./login.html";
			}			
		},
		// 查看更多
		readMore: function() {
			var _this = this;
			_this.count++;
			if (storage.getItem("userInfo")) {
				_this.UserId = JSON.parse(storage.getItem("userInfo")).UserId;
				_this.RoleType = JSON.parse(storage.getItem("userInfo")).RoleType;
				var useData = {
					ReportSourceType: 3,
					ReceiveUserId: JSON.parse(storage.getItem("userInfo")).UserId,
					Status: _this.bblkType,
					PageIndex: _this.count
				};

				axios({
						method: "post",
						url: "/Customer/GetReport",
						data: JSON.stringify(useData)
					})
					.then(function(r) {
						//console.log(r);
						if (r.data.code == '1001') {
							_this.dataTotal = r.data.data.TotalRecord;
							_this.bblk = (JSON.parse(lstorage.getItem("blcontent"))).concat(r.data.data.DataList); //合并两个数组
							lstorage.setItem("blcontent", JSON.stringify(_this.bblk));
						} else {
							$.toast("服务器繁忙", "text");
						}
					})
					.catch(function(error) {
						$.alert({
							title: '服务器错误',
							text: '"很抱歉，服务器出现错误，请稍后再试~"',
							onOK: function() {
								// window.location.href="./index.html";
							}
						})
					})
			} else {
				window.location.href = "./login.html";
			}
		},
		changeNum:function(n){
			n=n.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
			return n;
		},		
		// 截取浏览器地址id
		getUrlParam: function(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
	}
})
