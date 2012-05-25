/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	
	function EquipTime(initParam){
		//父类参数
		this.canvas = initParam.canvas;
		this.id = initParam.id;
		this.x = initParam.x || 0;
		this.y = initParam.y || 0;
		this.width = initParam.width || 0;
		this.height = initParam.height || 0;
		this.img =initParam.img || null;
		this.sx = initParam.sx || 0;
		this.sy = initParam.sy || 0;
			
	}
 	EquipTime.prototype = new Yy.Layer();
	/*
	 *	星星装备，位置，最后生成，保证不重复点	 
	 */
	var equipTimeConfig = { 
		type : 'equip',
		map : [],
			/*{ 'imgUrl' : 'images/tile.png',
			'sx' : 0,
			'sy' : 32,
			'width' : 32,
			'height' : 32, 
			 'x' : 0,
			 'y' : 0 
			},*/
		 
		list : [], 
		canvas : null,
		img : null, 
		timer : null,
		img : null,
		sum : 3,
		posArr : [],// 点位置
		
		
		init : function(canvas, sum){  
			this.canvas = canvas;
			this.sum = Equip.getTimeSum() || 3;
			
			this.resetData();
						
			this.makePos();	
			this.transToMap();
			this.initResource();
		},
		resetData : function(){
			this.list = [];
			this.posArr = [];	
			this.map = [];
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
				img.src = 'images/tile.png';
				this.img = img; 
			}
		},
		makePos : function(){ 
			//只能是通路点，同时不能开始和结束点
			var matrix = Yy.mazeMap.getMatrix();
			var tDPath = [];
			var rl = matrix.length;
			for (var k in matrix){
				var columns = matrix[k];
				if ( k < 2 || k > (rl - 2)){
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
				var rand = Math.ceil(Math.random() * length - 1);
				this.posArr.push(tDPath.splice(rand, 1)[0]);
			}
		},
		transToMap : function(){ 
			for (var k in this.posArr){ 
				var pos = this.posArr[k]; 
				var arr = { 'imgUrl' : 'images/tile.png',
						  'sx' : 32,
						  'sy' : 64,
						  'width' : 32,
						  'height' : 32,
						  'x' : pos[1] * 32,
						  'y' : pos[0] * 32
						}
				this.map.push(arr);	 
			}
		},
		drawMap : function(){
			for (var k in this.map){  
				var param = this.map[k];
				param.canvas = this.canvas;
				param.img = this.img;
				var o = new EquipTime(param);
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
		removeEquip : function(x, y){
			x = x - x%32;
			y = y - y%32; 
			for (var k in this.list){
				var o = this.list[k];
				if (o.getX() == x && o.getY() == y){
					this.list.splice(k, 1);	
				}
			} 
		},
		loaded : function(){
			Game.loadNext();
		},
		checkHit : function(rect){ 
			for (var k in this.list){
				var it = this.list[k];
				var tRect = it.getRect();
				if (Yy.checkRect(rect, tRect)){
					this.list.splice(k, 1);
					Timer.addTime();
					Dom.updateTime(Timer.getTime());
				}
			}
		}
		
	}
	
	Yy.config['equipTime'] = equipTimeConfig;
})(); 