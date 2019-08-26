// document.write("<script type='text/javascript' src='https://res.wx.qq.com/open/js/jweixin-1.4.0.js'></script>");
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL = 'http://hfugapi.centaline.com.cn';
// axios.defaults.baseURL = 'http://10.6.13.189:8012';
axios.defaults.baseURL = 'https://hfugapi.centaline.com.cn';
var phoneNum="4000-666-030";

//1. 用户  2.合作公司  3 资源运营 4销售人员  角色roletype

//所有页面公共JS
$(window).load(function() {
	$("#loadingDiv").addClass("loader-chanage")
	$("#loadingDiv").fadeOut(300);

})
var Sstorage=window.sessionStorage;	

$(function() {
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
