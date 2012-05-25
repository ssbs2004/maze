/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
 
	/*
	 *	静态障碍物
	 */
	var tileConfig = {
		type : 'tile', 
		map : [
			/*{ 'imgUrl' : 'images/tile_grass.png',
			  'sx' : 0,
			  'sy' : 0,
			  'width' : 32,
			  'height' : 32,
			  'x' : 10,
			  'y' : 100
			},*/
		],
		rows : 15,	//行必须3的倍数 12 
		columns :21, 	//列必须3的倍数 18
		list : [],
		canvas : null,
		img : null, //同一个资源图片，所以保存一个对象
		init : function(canvas){			
			this.canvas = canvas;			
			this.resetData();
				
			Yy.mazeMap.init(this.rows, this.columns);//行，列必须3的倍数
			this.transToMap();
			this.initResource();			
		},
		resetData : function(){
			this.list = [];		
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
		drawMap : function(){
			//同一个图片，可以一次加载图片 
			for (var k in this.map){  
				var param = this.map[k];
				param.canvas = this.canvas;
				param.img = this.img;
				var tileLayer = new Yy.TileLayer(param);
				tileLayer.draw();
				this.list.push(tileLayer); 
			}
			this.loaded();						 
		},
		getList : function(){
			return this.list;
		},
		draw : function(){
			for (var k in this.list){
				this.list[k].draw();	
			}
		},
		loaded : function(){
			Game.loadNext();
		},
		removeTile : function(x, y){
			//x,y是屏幕像素点，必须转换
			x = x - x%32;
			y = y - y%32; 
			for (var k in this.list){
				var o = this.list[k];
				if (o.getX() == x && o.getY() == y){
					this.list.splice(k, 1); 
					break;	
				}
			}
		},
		//*******
		transToMap : function(){
			var matrix = Yy.mazeMap.getMatrix();
			//matrix[0][0] = 0;
			matrix[1][0] = 0; //入口
			matrix[this.rows - 2][this.columns-1] = 0; //出口
			 
			for (var k in matrix){
				var columns = matrix[k];
				for (var i in columns){
					if (columns[i] != 0){
						var arr = { 'imgUrl' : 'images/tile.png',
								  'sx' : 32,
								  'sy' : 0,
								  'width' : 32,
								  'height' : 32,
								  'x' : i * 32,
								  'y' : k * 32
								}
						this.map.push(arr);		
					}
				}
			}
		}		
		
	}
	
	Yy.config['tile'] = tileConfig;
})();
