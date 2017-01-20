
var loaders=2;
function init(){if(!--loaders){
	var a,i;
	camera.setCenterPercent({x:0.5,y:0.5});
	Block.size=0;
	for(i in Block.stats){
		a=camera.image(i);
		Block.size=Math.max(Block.size,a.width,a.height);
		Block.sizes[i]=new Point(a).div(2);
	}
	console.debug(a,"a.width = "+a.width);
	player.setup();
	player.alive=0;
	document.body.appendChild(camera.c);
	interval(step,draw,60);
}}
window.onload=init;
readJSONFile("jump/chunks.json",function(a){
	chunks=a;
	init();
});
