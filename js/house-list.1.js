axios.defaults.headers.post['Content-Type'] = 'application/json';
  var app = new Vue({         // 创建Vue对象。Vue的核心对象。
    el: '.whole',               // el属性：把当前Vue对象挂载到 div标签上，#app是id选择器
    data: {                   // data: 是Vue对象中绑定的数据
			house_list:"",
			tj_arr:"",
			qy:"",
			dy:"",
			dt:"",
			addr:"",
			station:"",
			nowIndex:0,
    },
    beforeCreate:function(){//创建实例el前
    	
    },    
    created:function(){//创建实例el后
    	this.getData();
    },
    beforeMount:function(){//下面表示已执行方法  虚拟dom还没有内容
    	
    },    
    mounted:function(){//下面表示已执行方法  编译好html后在这操作
//  	this.down_load();
    },
    methods:{
// 	var arrAll =
// 		[
// 			{
// 				name: "北京",
// 				sub: [
// 					{name: "不限", sub: []},
// 					{
// 						name: "北京",
// 						sub: [{name: "请选择"}, {name: "东城区"}, {name: "西城区"}, {name: "崇文区"}, {name: "宣武区"}, {name: "朝阳区"}, {name: "海淀区"}, {name: "丰台区"}, {name: "石景山区"}, {name: "房山区"}, {name: "通州区"}, {name: "顺义区"}, {name: "昌平区"}, {name: "大兴区"}, {name: "怀柔区"}, {name: "平谷区"}, {name: "门头沟区"}, {name: "密云县"}, {name: "延庆县"}, {name: "其他"}],
// 						type: 0
// 					}], type: 1
// 			},
// 			{
// 				name: "广东",
// 				sub: [{name: "不限", sub: []},
// 					{
// 						name: "广州",
// 						sub: [{name: "请选择"}, {name: "越秀区"}, {name: "荔湾区"}, {name: "海珠区"}, {name: "天河区"}, {name: "白云区"}, {name: "黄埔区"}, {name: "番禺区"}, {name: "花都区"}, {name: "南沙区"}, {name: "萝岗区"}, {name: "增城市"}, {name: "从化市"}, {name: "其他"}],
// 						type: 0
// 					},
// 					{
// 						name: "深圳",
// 						sub: [{name: "请选择"}, {name: "福田区"}, {name: "罗湖区"}, {name: "南山区"}, {name: "宝安区"}, {name: "龙岗区"}, {name: "盐田区"}, {name: "其他"}],
// 						type: 0
// 					}],type: 1
// 			},
// 					
// 		];	
				
    	getData:function(){
				var that=this;
				that.house_list=[{href:"house_info.html",zk:"99折",addr:"深圳·福田",name:"远洋新天地二期",yt:"公寓",pm:"103",hx:"三室两厅",price:"35600",grade:"4.9",src:"img/a4.jpg"}];

				that.qy=[
					"深圳区域",
					"临深区域"
				];
					that.dy=["不限" ,"南山","福田","宝安"];
					that.dt=["不限","1号线","2号线","3号线"];
					that.addr=["不限" ,"南山1","福田1","宝安1"];  				
					that.station=["不限" ,"1号线1","2号线1","3号线1"];  				
				
//     		var a=[
// 					{
// 						z:{b:2,n:3},
// 						q:{w:2,e:3},
// 					}
// 				];
// 				//console.log(a);
// 				//console.log(a[0].z);
// 				//console.log(a[0].z.b);
    	},
    	down_load:function(e){
   		
    	},
xz:function(index){
				var that=this;
// 				axios.get("/",adr)
// 					.then(function(r){
// 						
// 					})
          that.nowIndex=index;
        }			
				
		},
})