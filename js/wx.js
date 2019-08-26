// 公共微信分享
// var url=location.href.split('#')[0];
//         url = encodeURIComponent(url);
// 截取浏览器地址id
function getUrlParam(name){
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	let r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;			
}
if(getUrlParam('from')&&getUrlParam('hid')){
	window.location.href="https://hfugweb.centaline.com.cn/house_info.html?id="+this.getUrlParam('hid')+"&from=other";
}	
if(getUrlParam('from')&&getUrlParam('id')){
	window.location.href="https://hfugweb.centaline.com.cn/house_info.html?id="+this.getUrlParam('id')+"&from=other";
}	
setTimeout(function(){
	if(Sstorage.getItem("urlf")==undefined&&getUrlParam('from')){
		window.location.href='index.html?from=other';
	}	
},100)
var tp="https://hfugweb.centaline.com.cn/img/share/wx_share_logo.jpg",
	ms="最全⼀⼿房源，五大购房福利，合作企业员工享受优惠折上折，品质生活从买到好房子开始！",
	bt="好房U购让购房更省心更优惠！",	
	u=window.location.href;	
function wxShared(){
	if(Sstorage.getItem("urlf")==String(window.location.href)){
		tp=Sstorage.getItem("tp");
		ms=Sstorage.getItem("ms");
		bt=Sstorage.getItem("bt");
		u=window.location.href;
	}
	
	shareAll();
	function shareAll(){	
		axios({
			method:"post",
			url:"/Wx/GetJsSdkUiPackage",
			data:JSON.stringify({Url:u})
		})
		.then(function(e){
			if(e.data.code==1001){
			  wx.config({
				  debug: false,
				  appId: e.data.data.AppId,
				  timestamp: e.data.data.Timestamp,
				  nonceStr: e.data.data.NonceStr,
				  signature: e.data.data.Signature,
				  jsApiList: ["updateAppMessageShareData","updateTimelineShareData","onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo","onMenuShareQZone",
						"chooseImage", "getNetworkType", "hideOptionMenu", "showOptionMenu", "hideMenuItems",
						"showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow"
					]
			  });			
			}
		})	
		.catch(function(n){
			
		})
	}	
	
	wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
	// 旧版
		wx.onMenuShareTimeline({ 
			title: bt, // 分享标题
			desc: ms, // 分享描述
			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})
		wx.onMenuShareAppMessage({ 
			title: bt, // 分享标题
			desc: ms, // 分享描述
			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})		
		wx.onMenuShareQQ({ 
			title: bt, // 分享标题
			desc: ms, // 分享描述
			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})	
		wx.onMenuShareWeibo({ 
			title: bt, // 分享标题
			desc: ms, // 分享描述
			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})
		wx.onMenuShareQZone({ 
			title: bt, // 分享标题
			desc: ms, // 分享描述
			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: tp, // 分享图标
			success: function () {
			  // 设置成功
			}
		})
	// 新版
// 		wx.updateAppMessageShareData({ 
// 			title: bt, // 分享标题
// 			desc: ms, // 分享描述
// 			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
// 			imgUrl: tp, // 分享图标
// 			success: function () {
// 			  // 设置成功
// 			}
// 		})
// 		wx.updateTimelineShareData({ 
// 			title: bt, // 分享标题
// 			desc: ms, // 分享描述
// 			link: u, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
// 			imgUrl: tp, // 分享图标
// 			success: function () {
// 			  // 设置成功
// 			}
// 		})																							
	});			
}
