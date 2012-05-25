/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	Yy.config = {};
	 /*
	 *	config原型
	 */
	var config = { 
		type : 'sprite', //equip sprite man weapon tile
		map : //为精灵或障碍物的图像绘制数据，通常包括对应的点和图片资源，可以为单个json数据或数组系列 
			/*{ 'imgUrl' : 'images/tile_grass.png',
			  'sx' : 0,
			  'sy' : 0,
			  'width' : 32,
			  'height' : 32,
			  'x' : 10,
			  'y' : 100
			},*/
		{
			'imgUrl' : 'images/sprite_man.png',
			'sx' : 0,
			'sy' : 0,
			'width' : 30,
			'height' : 45,
			'step' : 5 
		}
		,
		frameImgs : { //精灵行走序列
				'down' :  [[0, 0], [30, 0], [60, 0], [90, 0]],
				'left' :  [[0, 45], [30, 45], [60, 45], [90, 45]],
				'right' : [[0, 90], [30, 90], [60, 90], [90, 90]],
				'up' : 	  [[0, 135], [30, 135], [60, 135], [90, 135]]
		},
		list : [], //存放对象列表
		sprite : null, //如果只有一个，则用这个表示
		canvas : null,	//外面传入的canvas参数
		
		
		init : function(canvas){ 
		}, 
		initResource : function(){ 
		},
		//重新初始化数据，过关重启
		resetData : function(){
			this.list = [];	
		},
		drawMap : function(){ 
			//根据map上的数据绘制精灵或障碍物
		},
		getList : function(){
			return this.list;
		},
		draw : function(){	
			//绘制list或sprite		
			this.sprite.draw();
		},
		loaded : function(){ 
			//通知Game，已经加载完成
			Game.loadNext();
		},
		//sprite专属函数
		autoWalk : function(){
		},
		getCheckList : function(rect){
			
		}
	}
		 
})();
