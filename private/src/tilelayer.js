/*
 * Author : Yukin
 * blog:http://yukin.alloyteam.com
 */
 ;(function(){
	
	/*
	 * 静态障碍类
	 */	
	function TileLayer(initParam){
		//父类参数 
		this.canvas = initParam.canvas;
		this.x = initParam.x || 0;
		this.y = initParam.y || 0;
		this.width = initParam.width || 0;
		this.height = initParam.height || 0;
		this.img =initParam.img || null;
		this.sx = initParam.sx || 0;
		this.sy = initParam.sy || 0;
		
	}
	TileLayer.prototype = new Yy.Layer();
	
	Yy.TileLayer = TileLayer;	

})()