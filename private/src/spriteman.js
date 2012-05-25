;(function(){
	
	/*
	 *	精灵类: 人
	 */	
 	function SpriteMan(initParam){
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
		var curDirection = null,
			frameImgs = initParam.frameImgs || [],
			step = initParam.step || 3,
			frameIdx = -1;//从0开始，初值-1
		//=============== 		 
		this.walk = function(direction){	
			if (Game.isOver()){
				return false;	
			}
			if (!curDirection){
				curDirection = direction;	
			}
			if (curDirection != direction){
				frameIdx = -1; //默认值
			}	
			curDirection = direction;			 	 
			switch(direction){
				case 'down' : 
					this.y = this.y + step;
					if (Game.checkTileHit(this.getCheckRect())){
						this.y = this.y - step; 	
					}else{
						var ty = this.y + this.height;
						this.y = ty > this.canvas.height ? (this.canvas.height - this.height) : this.y;
					}
					break;
				case 'left' :
					this.x = this.x - step; 
					if (Game.checkTileHit(this.getCheckRect())){
						this.x = this.x + step; 
					}else{
						this.x = this.x < 0 ? 0 : this.x;
					}
					break;
				case 'right' :
					this.x = this.x + step; 
					if (Game.checkTileHit(this.getCheckRect())){
						this.x = this.x - step; 
					}else{
						var tx = this.x + this.width;
						this.x = tx > this.canvas.width ? (this.canvas.width - this.width) : this.x;
					}
					break;
				case 'up' : 
					this.y = this.y - step; 
					if (Game.checkTileHit(this.getCheckRect())){				 
						this.y = this.y + step;
					}else{
						this.y = this.y < 0 ? 0 : this.y; 
					}
					break;	
				default:
					return false;				
			}			
			var idxArr = frameImgs[direction];
			frameIdx = frameIdx > (idxArr.length - 2) ? 0 : (frameIdx + 1); 
			
			//和装备检测
			Game.checkEquip(this.getCheckRect());
			Game.checkGameIsOver(this.getCheckRect());
			//判断是否和老虎碰撞:碰撞则闪一下
			Game.checkSpriteHit(); 
		}
		
		this.draw = function(){ 
			frameIdx = frameIdx < 0 ? 0 : frameIdx;	 
			var idxArr = frameImgs[curDirection];					
			this.sx = idxArr[frameIdx][0],
			this.sy = idxArr[frameIdx][1]; 
			this.canvas.context.drawImage(this.img, this.sx, this.sy, this.width, this.height, 
											this.x, this.y, this.width, this.height);
		}
		
		//获取检查区域:缩小为脚步区域高度，同时出钱衣物的宽度
		this.getCheckRect = function(){
			var checkHeight = 5; //脚步用于检测的高度
			var clothWidth = 5;	//衣服多出的部分宽度
			var rect = this.getRect();
			rect[0] = this.x + clothWidth;
			rect[1] = this.y + this.height - checkHeight;
			rect[2] = this.x + this.width - clothWidth; 
			return rect;
		}	
		
		this.getDirection = function(){
			return curDirection;	
		}
	}
	SpriteMan.prototype = new Yy.Layer();	
	
	Yy.SpriteMan = SpriteMan;
	
})()