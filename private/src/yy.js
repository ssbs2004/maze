/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	var Yy = {
		isUndefined : function(o){
			return typeof(o) === "undefined";
		},
		getRandom : function(length){
			return Math.ceil(Math.random() * length - 1);
		},
		//矩形碰撞检测算法
		//rect:[x, y, width , height]
		checkRect : function(rect1, rect2){
			var w1 = rect1[2] - rect1[0];
			var h1 = rect1[3] - rect1[1];
			var w2 = rect2[2] - rect2[0];
			var h2 = rect2[3] - rect2[1];
			
			var x = Math.abs((rect2[0] + w2/2) - (rect1[0] + w1/2));
			var w = Math.abs((w1 + w2)/2);
			
			var y = Math.abs((rect2[1] + h2/2) - (rect1[1] + h1/2));
			var h = Math.abs((h1 + h2)/2);
			
			if ( (x <= w) && (y <= h) ){
				return true;
			}else{
				return false;	
			}
		}
		//扩展算法
	};
	
	Yy.timer = {
		timer : null,
		init : function(){
			this.stop();
			this.start();
		},
		start : function(){
			var count = 0;
			setInterval(function(){
				count++;
				Yy.event.notify('timer_20');
				if (count % 2 == 0){
					Yy.event.notify('timer_40');
				}
				if (count % 3 == 0){
					Yy.event.notify('timer_60');
				}
				if (count % 4 == 0){
					Yy.event.notify('timer_80');
				}
				if (count % 5 == 0){
					Yy.event.notify('timer_100');
				}
				if (count == 5){
					count = 0;
				}
			},20); //20是基准频率
		},
		stop : function(){
			if (this.timer){
				clearInterval(this.timer);	
			}
		}
	}
	//事件管理器
	Yy.event = {
		eventList:[],
		 //注册事件.context表示回到函数的运行环境this，如果此参数为空，在回调函数里面的this会改变
		listen: function(evtName, callback, context){ 
			if( typeof(evtName) == 'undefined' || typeof(callback) == 'undefined' ){
				return false;									 
			} 
			if( !this.hadRegister(evtName, callback) ){				 
				this.eventList[evtName] = this.eventList[evtName] || [];
				var o = {func: callback, context: context};
				this.eventList[evtName].push(o);
			}
		},
		//判断是否已经注册
		hadRegister: function(evtName, callback){
			var cbArr = this.eventList[evtName];
			if( typeof(cbArr) == 'undefined' ){
				return false;									 
			}
			var hadExist = false;
			for( var evt in cbArr ){	 
				var o = cbArr[evt];
				if( o.func === callback ){
					hadExist = true;
					break;
				} 
			}
			return hadExist;
		},
		//通知事件.如果没有context参数，则回调函数里面的this指向已经改变
		notify: function(evtName, notifyParam){
			var cbArr = this.eventList[evtName];
			if( typeof(cbArr) == 'undefined' ){
				return false;									 
			}
			for( var evt in cbArr ){	
				var o = cbArr[evt];
				if( typeof(o.context) == 'undefined' ){
					o.func(notifyParam);	
				}else{
					o.func.apply(o.context, [notifyParam]);
				}
			}
		},
		//绑定事件到某个函数上，不改变this
		bind: function(func, context, args){			
			return function(e){
				var arr = args ? [e].concat(args) : [e];
				func.apply(context, arr);
			}			 
		}
	}
	
	/*
	 * 物体基类
	 */
	function Layer(){
		/*
		每个子类根据实际需要定义如下变量
		this.canvas = null;必须定义{ context, width, height }
		this.id = null;  //id可以不用
		this.x = 0;		//canvas坐标X
		this.y = 0;		//canvas坐标Y
		this.width = 0;	//layer矩形宽度
		this.height = 0;	//layer矩形高度
		this.img = null; 	//layer Image对象
		this.sx = 0;	//layer绘制时image图片上的x起点
		this.sy = 0;	//layer绘制时image图片上的y起点
		*/
		this.getId = function(){
			return this.id;	
		}
		this.getX = function(){
			return this.x;	
		}
		this.getY = function(){
			return this.y;	
		}
		this.getWidth = function(){
			return this.width;
		}
		this.getHeight = function(){
			return this.height;
		}
		this.getRect = function(){
			return [this.x, this.y, (this.x + this.width), (this.y + this.height)];	
		}
		this.draw = function(){
			this.canvas.context.drawImage(this.img, this.sx, this.sy, this.width, this.height, 
									this.x, this.y, this.width, this.height);	
		}
		
	}
	Yy.Layer = Layer;
	
	
	/*
	 * 敌对精灵控制基类
	 */
	function EnemyControl(){
		/*
		this.cancas = null;
		this.sprite
		this.spriteList = [];
		this.spriteCount = 0;  //创建精灵的上限个数
		this.autoWalkCount = 0; //行走定时计数器
		*/
		
		//初始化
		function init(canvas){ 
			this.canvas = canvas;		
			//创建 
			var img = new Image(); 
			var tthis = this;
			img.onload = function(){
				for	(var k = 0; k < tthis.spriteCount; k++){
					var sprite = tthis.createSprite(img);
					if (!sprite){
						continue;	
					}
					tthis.spriteList[tthis.spriteList.length] = sprite;
				}			 
			}
			img.src = spriteConfig.imgUrl;
		};
		
		//创建一个精灵：如果创建条件符合则放弃
		function createSprite(img){
			//对于随机生成的坐标，要检测是否冲突 
			var rect = this.mkSpriteRect();	//如果重试多次无法 
			if (rect.length === 0){
				return null;
			}
			var dirtArr = ['left', 'right', 'up', 'down'];
			var param = spriteConfig;
			param.frameImgs = spriteFrameImgs;
			param.canvas = this.canvas;
			param.x = rect[0];
			param.y = rect[1];
			param.img = img;
			var idx = Math.floor(4 * Math.random()); 
			param.direction = dirtArr[idx];
			var sprite = new SpriteTokage(param);		
			sprite.walk();
			return sprite;		
		} 
		//随机生成精灵的初始位置
		function mkSpriteRect(){
			var canvas = this.canvas;	 
			//不能超出屏幕
			var x = Math.floor(canvas.width * Math.random()) -  spriteConfig.width,
				y = Math.floor(canvas.height * Math.random()) - spriteConfig.height;
			//不能一开始就和主精灵碰撞
			var minX = spriteConfig.width * 2,  
				minY = spriteConfig.height * 2;	
			x = x < minX ? minX : x;
			y = y < minY ? minY : y;	
			var rect = [x, y, (x + spriteConfig.width), (y + spriteConfig.height)];
			var count = 0;
			//尝试5次
			while (count++ < 5){
				if (!Game.checkTileLayerHit(rect)){
					return rect;	
				}
			}
			return []; //如果成功则返回空	
		} 
		//控制精灵走动:由外部定时器间隔调用
		function autoWalk(){
			var dirtArr = ['left', 'right', 'up', 'down'];
			var dirtIdArr = {'left':0, 'right':1, 'up':2, 'down':3};
			var list = this.spriteList;
			var timerCount = this.autoWalkCount;
			for (var k in list){
				if ( k != timerCount){
					continue;	
				}
				var sprite = list[k];
				//如果碰撞，则获得当前位置，然后随机改变另一方向 
				//没定时器到达，走一个，否则统一节奏很难看
				if (sprite.walk()){
					var id = dirtIdArr[sprite.getDirection()];
					var newIdx = id+1;
					newIdx = newIdx > 3 ? 0 : newIdx;
					var count = 0;
					while (count++ < 5){
						var idx = Math.floor(4 * Math.random());
						if (idx != id){
							newIdx = idx;
							break;	
						}					
					}
					sprite.setDirection(dirtArr[newIdx]);
				}			
			}
			this.autoWalkCount++;
			if (this.autoWalkCount >= this.spriteCount){
				this.autoWalkCount = 0;	
			}
			
		}
		
		function drawSprite(){
			var list = this.spriteList;
			for (var k in list){
				var sprite = list[k];  
				sprite.draw();	
			}
		}
	
		
	}
	
	 
	window.Yy = Yy; 
	
})();