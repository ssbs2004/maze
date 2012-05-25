/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	
	function SpriteBomb(initParam){
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
 	SpriteBomb.prototype = new Yy.Layer();
	/*
	 *	炸弹
	 */
	var bombConfig = { 
		type : 'weapon',
		map : 
			/*{ 'imgUrl' : 'images/tile_grass.png',
			  'sx' : 0,
			  'sy' : 0,
			  'width' : 32,
			  'height' : 32,
			  'x' : 10,
			  'y' : 100
			},*/
		{
			'imgUrl' : 'images/sprite_bomb.png',
			'sx' : 0,
			'sy' : 0,
			'width' : 32,
			'height' : 32,
			'step' : 0,
			 'x' : 0,
			 'y' : 0 
		},		
		frameImgs : {
				'down' :  [[0, 0], [30, 0], [60, 0], [90, 0]],
				'left' :  [[0, 45], [30, 45], [60, 45], [90, 45]],
				'right' : [[0, 90], [30, 90], [60, 90], [90, 90]],
				'up' : 	  [[0, 135], [30, 135], [60, 135], [90, 135]]
		},
		list : [], 
		canvas : null,
		
		timer : null,
		img : null,
		
		init : function(canvas){
			this.canvas = canvas;	
			this.resetData();			
			this.initResource();
		},
		resetData : function(){
			this.list = [];	
		},
		initResource : function(){
			if (this.img){
				this.loaded();
			}else{
				var img = new Image();
				var _this = this;
				img.onload = function(){ 
					_this.img = this;
					_this.loaded();
				};
				img.src = this.map.imgUrl;	
			}
		},
		drawMap : function(){
			//默认不需要一开始就显示			 
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
		setBomb : function(x, y, dirt){
			if (Equip.getBombSum() < 1){
				return false;	
			}
			//dirt : 方向 
			//转换成32 × 32起始点
			var tx = 0, ty =0;//增量
			
			switch(dirt){
				case 'down' :  ty += 2;
					break;
				case 'left' :  ty += 1; tx -= 1;
					break;
				case 'right' : ty += 1; tx += 1;
					break; 		
			}			
			var param = this.map;
			param.x = x - x%32 + tx * 32;
			param.y = y - y%32 + ty * 32; 
			param.canvas = this.canvas;
			param.img = this.img;
			var sprite = new SpriteBomb(param); 
			sprite.draw();
			this.list.push(sprite);
			var _this = this;
			setTimeout(function(){
				_this.doBomb(sprite);
			},500);
			Equip.reduceBomb();
			Dom.updateBomb();
		}, 
		doBomb : function(sprite){	 
			for (var k in this.list){
				var o = this.list[k];
				if (o == sprite){
					this.list.splice(k, 1);	
				}
			}
			Yy.config['tile'].removeTile(sprite.getX(), sprite.getY());
			Game.paintCanvas();		
		}
		
	}
	
	Yy.config['bomb'] = bombConfig;
})();
