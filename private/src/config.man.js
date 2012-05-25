/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
 	 
	/*
	 *	人物
	 */
	var manConfig = { 
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
			'imgUrl' : 'images/sprite_man.png',
			'sx' : 0,
			'sy' : 0,
			'width' : 30,
			'height' : 45,
			'step' : 16 
		}
		,
		frameImgs : {
				'down' :  [[0, 0], [30, 0], [60, 0], [90, 0]],
				'left' :  [[0, 45], [30, 45], [60, 45], [90, 45]],
				'right' : [[0, 90], [30, 90], [60, 90], [90, 90]],
				'up' : 	  [[0, 135], [30, 135], [60, 135], [90, 135]]
		},
		list : [],
		sprite : null, //只有一个
		canvas : null,
		
		
		init : function(canvas){
			this.canvas = canvas;
			this.resetData();		
			
			if (!this.img){			
				window.addEventListener('keydown', this.keydown, false);	
				window.addEventListener('keyup', this.keyup, false);
			}
			this.initResource();
		},
		resetData : function(){
			this.list = [];	
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
				img.src = 'images/sprite_man.png';
				this.img = img; 
			}
		},
		drawMap : function(){ 
			var param = this.map;
			param.frameImgs = this.frameImgs;
			param.canvas = this.canvas;
			param.img = this.img;
			this.sprite = new Yy.SpriteMan(param);					
			this.sprite.walk('right'); //默认站位
			this.sprite.draw();
			this.list.push(this.sprite);
			this.loaded(); 		 
		},
		getList : function(){
			return this.list;
		},
		getSprite : function(){
			return this.sprite;
		},
		draw : function(){			
			this.sprite.draw();
		},
		loaded : function(){
			Game.loadNext();
		},
		//****************
		keydown : function(e){  
			var keyCode = e.keyCode;
			var _this = manConfig;
			 switch(keyCode){
				case 37:  //left arrow
					_this.sprite.walk('left');
				break; 
				case 38:  //up arrow
					_this.sprite.walk('up');
				break; 
				case 39: //right arrow
					_this.sprite.walk('right');
				break; 
				case 40:  //down arrow
					_this.sprite.walk('down');
				break; 
				case 32:  //空格 bomb
					//因为人的区域比较大，所以比较修正位置，防止计算错误
					var x = _this.sprite.getX() + 5;// Math.floor(_this.sprite.getWidth()/2),
						y = _this.sprite.getY();//+ Math.floor(_this.sprite.getHeight()/2);
					Yy.config['bomb'].setBomb(x, y, _this.sprite.getDirection());
				break; 
				default : return false;
			}
			Game.paintCanvas();	
			e.stopPropagation();	
		},
		keyup : function(){
			
		}
		
	}
	
	Yy.config['man'] = manConfig;
})();
