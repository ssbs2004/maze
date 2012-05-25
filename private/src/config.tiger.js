/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
 	 
	/*
	 *	tiger
	 */
	var tigerConfig = { 
		type : 'sprite',
		map : []
			/*{ 'imgUrl' : 'images/tile_grass.png',
			  'sx' : 0,
			  'sy' : 0,
			  'width' : 32,
			  'height' : 32,
			  'x' : 10,
			  'y' : 100
			},*/
		 
		,
		frameImgs : {
			'down' :  [[0, 0], [29, 0], [58, 0], [87, 0]],
			'left' :  [[0, 31], [29, 31], [58, 31], [87, 31]],
			'right' : [[0, 62], [29, 62], [58, 62], [87, 62]],
			'up' : 	  [[0, 93], [29, 93], [58, 93], [87, 93]]
		},
		list : [],
		sprite : null, //只有一个
		canvas : null,
		posArr : [], //初始点
		sum : 3,
		autoWalkCount : 0, //自动行走计数器，防止同一个步伐走动，比较难看
		init : function(canvas){
			this.canvas = canvas;
			this.sum = Equip.getTigerSum() || 3;
			this.resetData();
					
			this.makePos();	
			this.transToMap();
			this.initResource();
		},
		resetData : function(){ 
			this.list = [];	
			this.map = [];
			this.posArr = [];
		},
		initResource : function(){
			if (this.img){
				this.drawMap();
			}else{
				var img = new Image(); 
				var _this = this;  
				img.onload = function(){ 
					_this.drawMap();
				}
				img.src = 'images/sprite_tiger.png'; 
				this.img = img; 
			}
		},
		drawMap : function(){ 
			var dirtArr = ['left', 'right', 'up', 'down'];
			for (var k in this.map){  
				var param = this.map[k];
				param.canvas = this.canvas;
				param.img = this.img;
				param.frameImgs = this.frameImgs;
				///var r = Yy.getRandom(4);
				param.direction = dirtArr[Yy.getRandom(4)]; 
				var o = new Yy.SpriteTiger(param);
				o.draw();
				this.list.push(o); 
			}
			this.loaded();			
		},
		getList : function(){
			return this.list;
		},
		draw : function(){	
			for (var k in this.list){
				var o = this.list[k];
				o.draw();	
			} 
		},
		loaded : function(){
			Game.loadNext();
		},
		//****************计算出现的位置
		makePos : function(){ 
			//只能是通路点，同时不能开始和结束点
			var matrix = Yy.mazeMap.getMatrix();
			var tDPath = [];
			var rl = matrix.length;
			for (var k in matrix){
				var columns = matrix[k];
				if ( k < 2 || k > (rl - 2)){//不在开始和结束点上
					continue;	
				}
				var ll = columns.length;
				
				for (var i in columns){
					
					if (i > 1 && i < (ll - 1 ) && columns[i] == 0){
						var arr = [k, i];
						tDPath.push(arr);		
					}
				}
			}
			var length = tDPath.length;
			var count = this.sum < length ? this.sum : length;		 
			while( (count--) > 0 ){ 
				length = tDPath.length;
				var rand = Yy.getRandom(length);
				this.posArr.push(tDPath.splice(rand, 1)[0]);
			}
		},
		transToMap : function(){ 
			for (var k in this.posArr){ 
				var pos = this.posArr[k]; 
				var arr = { 'imgUrl' : 'images/sprite_tiger.png',
						    'sx' : 0,
							'sy' : 0,
							'width' : 29,
							'height' : 31,
							'step' : 3, 
						    'x' : pos[1] * 32,
						    'y' : pos[0] * 32
						}
				this.map.push(arr);	 
			}
		},
		autoWalk : function(){		 
			var length = this.list.length;
			if (length < 1){
				return false;
			}
			var ll = length >= 5 ? length : 5;
			for (var k = 0; k < ll; k++){// in this.list){	//for (var k in this.list){
				if (k >= length || k != this.autoWalkCount){ 
					continue;	
				}
				var o = this.list[k]; 
				o.walk();
				o.draw();	
			} 
			this.autoWalkCount++;
			if (this.autoWalkCount >= ll){
				this.autoWalkCount = 0;	
			}
			/*for (var k in this.list){
				if (this.autoWalkCount % k == 0){
					var o = this.list[k]; 
					o.walk();
					o.draw();
				}					
			} 
			this.autoWalkCount++;*/
		},
		getChectList : function(rect){
			var checkList = [];
			for (var k in this.list){
				var r = this.list[k].getRect(); 
				if (rect[0] <= r[2] && rect[2] >= r[0] && 
					rect[1] <= r[3] && rect[3] >= r[1]
					){
					checkList.push(this.list[k]);	
				}
			}
			return checkList;	
		}
		
	}
	
	Yy.config['tiger'] = tigerConfig;
})();
