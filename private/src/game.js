/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	var canvas = {
			context : document.getElementById('gameCanvas').getContext('2d'),
			width : document.getElementById('gameCanvas').width, //640 20
			height : document.getElementById('gameCanvas').height //512 16
	};
	
	//初始化地图和资源
	var Game = {
		passCount : 0, //关卡
		isEnd : false,
		loadingNextPass : false, //判断是否正在加载下一关
		loadStock : [],
		init : function(){
			this.passCount++; //关键加一，第一关
			if (this.passCount > 8){ 
				this.gameAll();//通关
				return false;	
			}
			this.clearCanvas();
			Equip.init(this.passCount);
			Dom.init();
			Dom.updatePassNumber(this.passCount);
			var loadSeq = ['tile', 'bomb', 'equipStar', 'equipTime', 'tiger', 'man'];
			var configArr = Yy.config;
			for (var k = (loadSeq.length - 1); k >= 0; k--){ 
				var key = loadSeq[k];
				if (configArr[key]){
					this.loadStock.push(configArr[key]);
				}
			}
			this.startLoad();
			
		}, 
		//清除画布
		clearCanvas : function(){
			canvas.context.clearRect(0, 0, canvas.width, canvas.height); 
		},
		//绘制画布上的元素
		paintCanvas : function(){
			this.clearCanvas();	 
			var configArr = Yy.config;
			for (var k in configArr){
				configArr[k].draw();
			}
		}, 
		//定时更新敌对精灵位置
		intervalPaint : function(){ 
			var configArr = Yy.config;
			for (var k in configArr){
				var o = configArr[k];
				if (o.type == 'sprite'){
					o.autoWalk();
				}
			}
			this.paintCanvas();
		},
		//*************静态物体检查***********
		//帅选需要检测的物体
		getcheckTileHitList : function(x1,y1, x2, y2){ 
			var checkList = [];
			var tileLayerList = Yy.config['tile'].getList();
			for (var k in tileLayerList){
				var rect = tileLayerList[k].getRect(); 
				if (x1 <=rect[2] && x2 >= rect[0] && 
					y1 <=rect[3] && y2 >= rect[1]
					){
					checkList.push(tileLayerList[k]);	
				}
			}
			return checkList;
		},
		//根据传入的矩形区域判断是否碰撞
		checkTileHit : function(rect){ 
			var checkList = this.getcheckTileHitList(rect[0], rect[1], rect[2], rect[3]); 
			if (checkList.length === 0){
				return false;	
			}
			for (var k in checkList){
				var it = checkList[k];
				var tRect = it.getRect();
				if (Yy.checkRect(rect, tRect)){
					return true;
				}
			}
			return false;
		},
		//*************检测装备*********************
		checkEquip : function(rect){
			var configArr = Yy.config;
			for (var k in configArr){
				var o = configArr[k];
				if (o.type == 'equip'){
					o.checkHit(rect);
				}
			}
		},	
		//*************检测精灵碰撞***********
		checkSpriteHit : function(){
			var man = Yy.config['man'].getSprite(), list = [], rect = man.getCheckRect(); 
			var configArr = Yy.config; 
			for (var k in configArr){
				var o = configArr[k];
				if (o.type == 'sprite'){
					var l = o.getChectList(rect);  
					list = list.concat(l);
				}
			}  
			for (var k in list){
				if (Yy.checkRect(rect, list[k].getCheckRect())){
					this.spriteHit();
					break;	
				}
			}
		},
		//响应碰撞
		spriteHit : function(){
			/*Dom.tips('hit');
			setTimeout(function(){
				Dom.hideTips();
			}, 1000);*/
			this.gameOver();
		},
		///******************
		startLoad : function(){
			this.loadNext();
		},
		loadNext : function(){
			if ( this.loadStock.length > 0){
				var o = this.loadStock.pop();
				o.init(canvas);	
			}else{
				this.loaded();	
			}
		},
		//全部载入完成
		loaded : function(){
			Timer.init();
			Dom.hideTips();
			this.loadingNextPass = false;
			Yy.timer.init();
			Yy.event.listen('timer_60', this.intervalPaint, this);
		},
		checkGameIsOver : function(rect){
			if (this.loadingNextPass){
				return false;	
			}
			var _this = this;
			if (rect[0] >= (canvas.width - 32) && rect[1] >= (canvas.height - 64) ){
				Dom.gameOver('恭喜过关！！');
				this.loadingNextPass = true;	
				setTimeout(function(){	 
					_this.init();
				},1000);
			}
		},
		gameOver : function(){
			this.isEnd = true;
			Dom.gameOver('游戏结束');
			Timer.clearTime();
		},
		gameAll : function(){
			Dom.tips('通关');
			this.isEnd = true; 
			Timer.clearTime();
		},
		isOver : function(){
			return this.isEnd;	
		}
	}
	window.Game = Game;
	
	var Dom = {
		dom : {},		
		init : function(){
			if (!this.dom.bomb){
				this.dom.bomb = document.getElementById('bomb_number');				
				this.dom.tips = document.getElementById('tips');
				this.dom.time = document.getElementById('game_time');
				this.dom.next = document.getElementById('nextGame');
				this.dom.pass = document.getElementById('pass_number');
				var _this = this;
				this.dom.next.addEventListener('click', function(){
					_this.onNextGame();	
				}, false);	
			}
			this.dom.bomb.innerHTML = Equip.getBombSum();
			this.tips('Loading...'); 
		},
		updatePassNumber : function(pass){
			this.dom.pass.innerHTML = pass + '/' + 8;
		},
		updateBomb : function(){ 
			this.dom.bomb.innerHTML = Equip.getBombSum();
		},
		gameOver : function(txt){
			this.tips(txt);
			Game.clearCanvas(); 
		},
		tips : function(txt){
			this.dom.tips.innerHTML = txt;
			this.dom.tips.style.display = 'block';
		},
		hideTips : function(){
			this.dom.tips.style.display = 'none';
		},
		updateTime : function(txt){
			this.dom.time.innerHTML = txt;
		},
		onNextGame : function(){
			//this.init();
			Game.init();	
		}
		
	}
	window.Dom = Dom;
	
	var Equip = {
		bombSum : 15,
		tile : 3, //关键路径上障碍数码
		star : 3, //星星数量
		time : 3,  //时间心型数量
		tiger : 3, //老虎数量
		passEquip : [[1, 1, 1, 1, 2],[2, 2, 2, 2, 3],
					 [3, 3, 3, 3, 3],[4, 4, 5, 5, 3],
					 [4, 4, 4, 4, 4],[5, 5, 7, 7, 4],
					 [5, 5, 6, 6, 4],[5, 5, 5, 5, 5]],
		init : function(passCount){
			if (passCount > this.passEquip.length){
				return false;	
			}
			//初始化星星，即：炸弹装备
			var arr = this.passEquip[passCount-1];
			this.bombSum = arr[0];
			this.tile = arr[1];
			this.star = arr[2];
			this.time = arr[3];	
			this.tiger = arr[4];		
		},
		//*******star*****
		getStarSum : function(){
			return this.star;
		},
		getTimeSum : function(){
			return this.time;
		},
		getTileSum : function(){
			return this.tile;
		},
		getTigerSum : function(){
			return this.tiger;
		},
		//***********************
		getBombSum : function(){
			return this.bombSum;
		},
		reduceBomb : function(){
			if (this.bombSum > 0){
				--this.bombSum;
			}
		},
		addBomb : function(){
			++this.bombSum;	
		}
	}
	window.Equip = Equip;
	/*
	 * 游戏时间管理
	 */
	var Timer = {
		timer : null,
		time : 60,
		init : function(){
			this.time = 60;
			if (this.timer){
				clearInterval(this.timer);
			}
			this.start();
		},
		start : function(){
			var _this = this;
			this.timer = setInterval(function(){
				if (_this.time >= 0){
					Dom.updateTime(_this.time--);
				}else{
					Game.gameOver();					
				}
			},1000);
		},
		addTime : function(){
			this.time += 60;	
		},
		getTime : function(){
			return this.time;	
		},
		clearTime : function(){
			clearInterval(this.timer);
		}
	}
	window.Timer = Timer;
	
	
	function init(){ 
		Game.init();
	}
	
	init();
	
})();