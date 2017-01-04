
var loaders=2;
function init(){if(!--loaders){
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
