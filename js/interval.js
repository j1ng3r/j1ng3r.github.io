window.interval=function(){
	function interval(logic,draw,logic_fps){
		window.requestAnimationFrame(function a(){
			draw();
			window.requestAnimationFrame(a);
		});
		setInterval(logic,1000/logic_fps);
	}
	return interval;
}();

Number.prototype.times=function(f){for(var i=0,a=this.valueOf();i<a;i++)f();};
