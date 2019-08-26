document.write("<script type='text/javascript' src='jweixin-1.0.0.js'></script>");
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL = 'http://hfugapi.centaline.com.cn';
// axios.defaults.baseURL = 'http://10.6.13.189:8012';
axios.defaults.baseURL = 'http://hfugapi.centaline.com.cn';
var phoneNum="4000-666-030";

//1. 用户  2.合作公司  3 资源运营 4销售人员  角色roletype

//所有页面公共JS
$(window).load(function() {
	$("#loadingDiv").addClass("loader-chanage")
	$("#loadingDiv").fadeOut(300);

})
var Sstorage=window.sessionStorage;	
//监听加载状态改变
// document.onreadystatechange = completeLoading;
// 
// //加载状态为complete时移除loading效果
// function completeLoading() {
//     if (document.readyState == "complete") {
//         var loadingMask = document.getElementById('loadingDiv');
//         loadingMask.parentNode.removeChild(loadingMask);
//     }
// }	
function shareFriend(){
var imgUrl = 'http://www.baidu.com/images/share.jpg';  // 分享后展示的一张图片
var lineLink = 'http://www.baidu.com'; // 点击分享后跳转的页面地址
var descContent = "描述信息";  // 分享后的描述信息
var shareTitle = '标题';  // 分享后的标题
WeixinJSBridge.invoke('sendAppMessage',{
	"img_url": imgUrl,
	"img_width": "200",
	"img_height": "200",
	"link": lineLink,
	"desc": descContent,
	"title": shareTitle
}, function(res) {
   
})
}
$(function() {
//     function checkClinetModel() {
//         //获取请求头中的userAgent
//         var u = navigator.userAgent;
//         //是否是android浏览器
//         var isAndroid = u.indexOf('Android') > -1;
//         //是否是ios浏览器
//         var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//         var msg = '';
//         if (isAndroid) {
//             msg = "当前是android客户端";
//         } else if (isIos) {
//             msg = '当前是ios客户端';
//         } else {
//             msg = '当前是pc端';
//         };
//         document.getElementById("msg").innerHTML = msg;
//     };
//     checkClinetModel();	
	//设计稿的宽度/100px 假如设计稿为750px  所以可设置所有机型的页面页面总宽为7.5rem  依据设计稿中的200px在这里就设为2rem		
	//	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px'+'!important';
	if (document.documentElement.clientWidth < 751) {
		$('html').css('font-size', document.documentElement.clientWidth / 7.5 + 'px');
	} else {
		$('html').css('font-size', '50px');
	}
	$(".whole").scroll(function() {
		if ($(".whole").scrollTop() > 100) {
			$('#scrollUp').fadeIn(300);
		} else {
			$('#scrollUp').fadeOut(200);
		}
	})
// 	setInterval(function() {
// 		var s = $(".whole").scrollTop();
// 		setTimeout(function() {
// 			var h = $(".whole").scrollTop();
// 			if (h - s > 0) {
// 				$("footer").hide();
// 			} else if (h - s <= 0) {
// 				$("footer").fadeIn();
// 			} 
// 			else if (h - s == 0) {
// 				if ($("footer").is(":hidden")) {
// 					$("footer").hide();
// 				} else {
// 					$("footer").show();
// 				}
// 			}
// 		}, 200);
// 	}, 200);

	$('#scrollUp').click(function() {
		$(".whole").animate({
			scrollTop: '0px'
		}, 300);
		return false;
	});
	
	$(".whole").scroll(function () {
		var str = window.location.href;
		str = str.substring(str.lastIndexOf("/") + 1);
		var top = String($(".whole").scrollTop());
		Sstorage.setItem(str,top);
	})	
})
// 判断pc和移动端
// $(function(){
//     var mobile_flag = isMobile(); // true为PC端，false为手机端
// 
//     if(mobile_flag){
// 		$("body").html("请在手机上浏览");
// 		$("body").css({"text-align":"center","padding-top":"2rem","font-size":"0.6rem","color":"#03a9f4"});
//     }
// });
// 
// function isMobile() {
//     var userAgentInfo = navigator.userAgent;
// 
//     var mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];
// 
//     var mobile_flag = false;
// 
//     //根据userAgent判断是否是手机
//     for (var v = 0; v < mobileAgents.length; v++) {
//         if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
//             mobile_flag = true;
//             break;
//         }
//     }
// 
//      var screen_width = window.screen.width;
//      var screen_height = window.screen.height;    
// 
//      //根据屏幕分辨率判断是否是手机
//      if(screen_width < 500 && screen_height < 800){
//          mobile_flag = true;
//      }
// 
//      return mobile_flag;
// }