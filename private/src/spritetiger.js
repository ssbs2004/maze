/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	
	/*
	 *	精灵类: 老虎
	 */	
 	function SpriteTiger(initParam){ 
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
		
		//私有变量
		var direction = initParam.direction,  //默认走动方向
			frameImgs = initParam.frameImgs || [],
			step = initParam.step || 3,
			frameIdx = -1;//从0开始，初值-1
		//=============== 		
		this.init = function(){
			//Yy.event.listen('timer_20',
		}
		
		this.walk = function(){	
			var isHit = false;//如果碰撞，则自动转变方向
			switch(direction){
				case 'down' : 
					this.y = this.y + step;
					if (Game.checkTileHit(this.getCheckRect())){  
						this.y = this.y - step;
						isHit = true; 	
					}else{
						var ty = this.y + this.height;
						if (ty > this.canvas.height){
							this.y = this.canvas.height - this.height;
							isHit = true; 
						}						
					}
					break;
				case 'left' :
					this.x = this.x - step; 
					if (Game.checkTileHit(this.getCheckRect())){ 
						this.x = this.x + step; 
						isHit = true; 	
					}else{
						if (this.x < 0){
							this.x = 0;
							isHit = true; 		
						}						
					}
					break;
				case 'right' :
					this.x = this.x + step; 
					if (Game.checkTileHit(this.getCheckRect())){
						this.x = this.x - step; 
						isHit = true; 	
					}else{
						var tx = this.x + this.width;
						if (tx > this.canvas.width){
							this.x = this.canvas.width - this.width;
							isHit = true; 	
						}						
					}
					break;
				case 'up' : 
					this.y = this.y - step; 
					if (Game.checkTileHit(this.getCheckRect())){	 	 
						this.y = this.y + step;
						isHit = true; 	
					}else{
						if (this.y < 0){
							this.y = 0;
							isHit = true; 		
						}
					}
					break;	
				default:
					return false;				
			}			
			var idxArr = frameImgs[direction];
			frameIdx = frameIdx > (idxArr.length - 2) ? 0 : (frameIdx + 1);		 
			
			if (isHit){
				this.changeDirection();
			}
			//检测是否和主精灵碰撞
			Game.checkSpriteHit();
			return isHit;
		}
		this.changeDirection = function(){
			var dirtArr = ['left', 'right', 'up', 'down'];
			var arr = [];
			for (var k in dirtArr){
				var d = dirtArr[k];
				if (d == direction){
					continue;	
				}
				arr.push(d);
			}
			direction = arr[Yy.getRandom(arr.length)];
		}
		this.setDirection = function(dirt){
			direction = dirt;
		}
		this.getDirection = function(){
			return direction;	
		}
		this.draw = function(){ 
			frameIdx = frameIdx < 0 ? 0 : frameIdx;	 
			var idxArr = frameImgs[direction];					
			this.sx = idxArr[frameIdx][0],
			this.sy = idxArr[frameIdx][1]; 
			this.canvas.context.drawImage(this.img, this.sx, this.sy, this.width, this.height, 
											this.x, this.y, this.width, this.height);
		}
		
		//获取检查区域:缩小为脚步区域高度，同时出钱衣物的宽度
		this.getCheckRect = function(){
			//var checkHeight = this.height - 2; //脚步用于检测的高度 y方向修正
			//var clothWidth = 0;	//衣服多出的部分宽度 x方向修正
			var rect = this.getRect();
			rect[0] += 5;
			rect[1] += 5;
			rect[2] -= 5; 
			rect[2] -= 5; 
			return rect;
		}	
			 
	}
	SpriteTiger.prototype = new Yy.Layer();	
	
	Yy.SpriteTiger = SpriteTiger;
	
})()