/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	
	/*
	 *生成地图矩阵类
	 */	
	 
	//标识：0标识通过，1标识未通过
	var mapMaker = {
		rows : 0, //行
		columns : 0, //列表
		path : [],	//new Array(this.rows * this.columns), //存储路径
		keyPath : [],
		matrix : new Array(this.rows), 
		init : function(r, c){
			this.rows = r;
			this.columns = c;
			this.path = [];
			this.keyPath = [];
			this.matrix = new Array(this.rows);
			
			for (var i = 0; i < this.rows; i++){
				this.matrix[i] = new Array(this.columns);	
				for (var k = 0; k < this.columns; k++){
					this.matrix[i][k] = 1;
				}
			}
			this.matrix[0][0] = 0; //第一个为入口
			this.matrix[this.rows - 1][this.columns - 1] = 1;
			
			this.generate();
			this.makeKeyPath(); 
		},
		generate : function(o){
			var stock = this.path; 
			var arr = [0, 0]; 
			while(arr){ 				
				var next = this.getNextRandStep(arr[0], arr[1]);
				if (!next){
					this.matrix[arr[0]][arr[1]] = -1; //不通节点 
					arr = stock.pop(); //回退	 
				}else{
					stock.push(arr); //入栈，
					this.matrix[next[0]][next[1]] = 0; //标识为路径点 
					if (next[0] == this.rows - 1 && next[1] == this.columns - 1){	//最后
						stock.push(next);				
						break;
					}else{ 
						arr = next;	//深度优先
					}
				}
			}		
			 
		},
		//获取关联的所有点
		getNext : function(r, c, status){
			var tmpArr = []; 
			//status = status || 1; //根据状态码返回相邻的节点: 1未遍历，-1不可通，0通过
			//up
			if (this.matrix[r - 1] && !Yy.isUndefined(this.matrix[r - 1][c]) && this.matrix[r - 1][c] == status){
				tmpArr.push([r - 1, c]);	
			}
			//down
			if (this.matrix[r + 1] && !Yy.isUndefined(this.matrix[r + 1][c]) && this.matrix[r + 1][c] == status){
				tmpArr.push([r + 1, c]);	
			}
			//left
			if (this.matrix[r] && !Yy.isUndefined(this.matrix[r][c - 1]) && this.matrix[r][c - 1] == status){
				tmpArr.push([r, c - 1]);	
			}
			//right
			if (this.matrix[r] && !Yy.isUndefined(this.matrix[r][c + 1]) && this.matrix[r][c + 1] == status){
				tmpArr.push([r, c + 1]);	
			}
			var count = tmpArr.length;
			if (count == 0){
				return null;
			}
			return tmpArr;
		},
		//获取随机的下一步
		getNextRandStep : function(r, c){
			var nextArr = this.getNext(r, c, 1);
			if (!nextArr){
				return null;	
			}
			var count = nextArr.length;
			var rand = Math.ceil(Math.random() * count - 1);
			var arr = nextArr[rand];
			this.matrix[arr[0]][arr[1]] = 2;//备选 
			return nextArr[rand];
		},
		//生成关键路径
		makeKeyPath : function(){
			for (var k in this.path){  
				var arr = this.path[k];
				var nextArr = this.getNext(arr[0], arr[1], 0);	 
				if (nextArr && nextArr.length == 2){
					this.keyPath.push(arr);		
				}
			};
		},
		getMatrix : function(){
			return this.matrix;
		},
		getPath : function(){
			return this.path;
		} 		
			
	};	
	/*
	 *	岔路类
	 */
	//标识：0标识通过，1标识未通过
	var disturbMaker = {		 
		path : [],	 
		disturbPath : [], //岔道路径
		matrix :[], 
		init : function(matrix, path){
			this.matrix = matrix;
			this.path = path;
			this.disturbPath = [];//岔道路径	 			
			this.generate(); 
		},
		generate : function(){ 
			var stock = [];	 
			for (var k in this.path){
				var arr = this.path[k];  
				 
				var stock = arr, tryFisrt = true;				 
				while(stock){ 				
					var next = this.getNextRandStep(stock[0], stock[1]);
					if (!next){  
						break;//终止内循环，下一个:尝试一次 		  
					}
					//先判断下一个节点是否合法
					var oldStatus = this.matrix[next[0]][next[1]];
					this.matrix[next[0]][next[1]] = 0;//先设置可行，不行则回退 
				
					if (!this.checkNextStep(next[0], next[1])){ 
						this.matrix[next[0]][next[1]] = oldStatus; //复原状态
						if (tryFisrt){
							tryFisrt = false; //重试一次 stock不变							
						}else{
							tryFisrt = true;
							break;//终止内循环，下一个:尝试一次
						}
					}else{						 
						this.matrix[next[0]][next[1]] = 0;	
						this.disturbPath.push(next);//保存点	 
						//Yy.mazeMap.draw(next, 0);			
						stock = next;	//深度优先 
					}
				} 
			}		
			 
		},
		 
		getNext : function(r, c){ 
			var tmpArr = [];  
			//up
			if (this.matrix[r - 1] && !Yy.isUndefined(this.matrix[r - 1][c]) && this.matrix[r - 1][c] != 0){ 
				tmpArr.push([r - 1, c]);	
			}
			//down
			if (this.matrix[r + 1] && !Yy.isUndefined(this.matrix[r + 1][c]) && this.matrix[r + 1][c] != 0){
				tmpArr.push([r + 1, c]);	
			}
			//left
			if (this.matrix[r] && !Yy.isUndefined(this.matrix[r][c - 1]) && this.matrix[r][c - 1] != 0){
				tmpArr.push([r, c - 1]);	
			}
			//right
			if (this.matrix[r] && !Yy.isUndefined(this.matrix[r][c + 1]) && this.matrix[r][c + 1] != 0){
				tmpArr.push([r, c + 1]);	
			}
			var count = tmpArr.length;
			if (count == 0){
				return null;
			}
			return tmpArr;
		},
		//获取随机的下一步
		getNextRandStep : function(r, c){ 
			var nextArr = this.getNext(r, c, 1);
			if (!nextArr){
				return null;	
			} 
			var count = nextArr.length;
			var rand = Math.ceil(Math.random() * count - 1);  
			return nextArr[rand]; 			
		},
		checkNextStep : function(r, c){
			var nextArr = this.getNext(r, c, 1);
			if (!nextArr){
				return false;	
			} 
			var count = nextArr.length;		 
			if (count >= 3){ //必须3面为未通过 
				return true;
			}else{
				return false;	
			}	
		},
		getDisturbPath : function(){
			return this.disturbPath;
		}
	};
	/*
	 *mazeMap类:生成迷宫原始数据，并生成岔路
	 */	
	Yy.mazeMap = {
		/*height : 32, //行
		width : 32, //列表*/
		rows : 3 * 0, //高 3的倍数
		columns : 3 * 0,	//宽 3的倍数
		path : [],	/*//new Array(this.rows * this.columns), //存储路径*/
		matrix : [], 
		/*canvas : null,
		img : null,*/
		init : function(/*canvas, img,*/ rows, column){
			/*this.canvas = canvas;
			this.img = img;*/
			this.rows = rows;	//canvas.height / this.height;
			this.columns = column;	//canvas.width / this.width;
			
			this.path = [];
			this.matrix = [];
			
			mapMaker.init((this.rows / 3), (this.columns / 3));
			
						
			for (var i = 0; i < this.rows; i++){
				this.matrix[i] = new Array(this.columns);	
				for (var k = 0; k < this.columns; k++){
					this.matrix[i][k] = 1;
				}
			}
			this.transToMap();
			this.makePath();
			disturbMaker.init(this.matrix, this.path); //生成岔路
			this.makeTile(); //在关键点上设置障碍
			
			//this.outMatrix();
			
			
		},
		//联通路径
		transToMap : function(){
			var sPath = mapMaker.getPath();
			//this.path = sPath;
			var last = null;
			for (var k in sPath){	
				var arr = sPath[k];				
				if (!last){
					last = arr;
					continue;	
				}				
				var dirt = this.getDirt(last, arr);
				this.updateMatirx(dirt, last, arr);
				last = arr;
			};
			
			//所有点为0的为路径
		},
		//联通路径
		updateMatirx : function(dirt, from, to){	 
			var x = from[0] * 3, y = from[1] * 3;		
			this.matrix[x + 1][y + 1] = 0; //中心点
			//this.draw([x + 1, y + 1], 4);
			
			x = to[0] * 3, y = to[1] * 3;		
			this.matrix[x + 1][y + 1] = 0; 
			//this.draw([x + 1, y + 1], 4); 
			//先设置中心点，再修改方向 
			switch(dirt){
				case 1 : // right ->left 
						 this.setDirt(1, from);
						 this.setDirt(2, to);
					break;
				case 2 : //left -> right
						this.setDirt(2, from);
						 this.setDirt(1, to);
					break;	
				case 4 : //down
						this.setDirt(3, from);
						 this.setDirt(4, to);
					break;
				case 3 : //up
						this.setDirt(4, from);
						this.setDirt(3, to);
					break;	
			}
		},
		setDirt : function(dirt, arr){	
			var x = arr[0] * 3, y = arr[1] * 3;
			var r, c;									
			switch(dirt){
				case 1 : r = x + 1; c = y; //left
					break;
				case 2 : r = x + 1; c = y + 2;  //right
					break;	
					
				case 4 : r = x + 2; c = y + 1;//down
					break;
				case 3 : r = x; c = y + 1;	//up
					break;			
			}
			this.matrix[r][c] = 0;
			//this.draw([r, c], 3);
		},
		// up 1, down 2, left 3, right 4
		getDirt : function(from, to){
			//arr : [r,c]
			if (from[0] == to[0]){ //left or right
				if (from[1] < to[1]){ //left -> right
					return 2;
				}else{ // right ->left
					return 1;
				}
			}else if (from[0] < to[0]){ //up  
				return 3;
			}else{ // down
				return 4;
			}
		},
		makePath : function(){
			for (var i = 0; i < this.rows; i++){ 
				for (var k = 0; k < this.columns; k++){
					if (this.matrix[i][k] == 0){
						this.path.push([i, k]);
					}
				}
			}
		},
		outPath : function(){
			for (var k in this.path){   
				this.draw(this.path[k], 3); 
			};
		},
		outPathByStep : function(){
			var _this = this;
			var k = 0;
			var timer = setInterval(function(){ 
				_this.draw(_this.path[k], 3);	
				k++;
				if (k >= _this.path.length){
					clearInterval(timer); 
					
					/*setTimeout(function(){ 
						_this.outMatrix();
					}, 2000);*/
				}
			},100);
		},
		outMatrix : function(){			
			for (var i = 0; i < this.rows; i++){ 
				for (var k = 0; k < this.columns; k++){
					if (this.matrix[i][k] == 0){//
						this.draw([i, k], 0);
					}
				}
			}
		},
		makeTile : function(){
			//设置障碍
			var length = this.path.length - 4; //分别去除前面和后面2
			var sum = Equip.getTileSum();
			for (var k = 0; k < sum; k++){				
				var rand = Math.ceil(Math.random() * length - 1);
				rand += 2;
				var arr = this.path[rand];
				this.matrix[arr[0]][arr[1]] = 2;//后面添加的障碍
				//this.draw(arr, 1); 
			}
			
		},
		getMatrix : function(){
			return this.matrix;
		},
		getPath : function(){
			return this.path;
		},
		getDisturbPath : function(){
			return disturbMaker.getDisturbPath();
		},
		draw : function(arr, type){  
			var y = arr[0] * 32,
				x = arr[1] * 32;
			var tileMap = [
				[0, 0], // 0 地图
				[32, 0], // 1灰色，默认墙
				[64, 0], //2黄色，不可通墙
				[0, 32], //3红色，路径
				[32, 32], //4绿色，关键节点
				[64, 32] //5绿色红点，关键节点中的核心节点
			];
			var s = tileMap[type];
				
			var param = {canvas: this.canvas, img : this.img,  x : x, y: y, width : 32, height : 32, sx : s[0], sy : s[1]}
			var tileLayer = new Yy.TileLayer(param);
			tileLayer.draw(); 	
		}
	}
	

})() 