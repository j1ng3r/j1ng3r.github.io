function step(){
    if(pad.getInput("refresh"))history.go();
    if(player.alive){
        player.step();
		for(var i of Block.all)
			i.step();
        player.endStep();
        chunkify();
	} else {
        if(pad.getInput("start")){
            player.setup();
            for(var i=0;i<20;i++)addChunk(0);
            chunkify();
        }
	}
    pad.endStep();
	camera.setCamera(player.pos.x-camera.c.width/4,player.pos.y-camera.c.height/3);
    var R=camera.RGB[0],G=camera.RGB[1],B=camera.RGB[2],S=1;
    if(R==255&&G!=255){
        G+=S;
        B-=S;
    } else if(G==255&&B!=255){
        B+=S;
        R-=S;
    } else if(B==255&&R!=255){
        R+=S;
        G-=S;
    } else {
        throw"Reset color to [255,255,0]";
    }
    camera.RGB=[R,G,B];
}
function draw(){
    var a=(camera.RGB[0]*256+camera.RGB[1])*256+camera.RGB[2];
	camera.ctx.fillStyle="#"+"0".repeat(6-a.toString(16).length)+a.toString(16);
	camera.drawRect(0,0,camera.c.width,camera.c.height);
	for(var i of Block.all)
		i.draw();
	player.draw();
    if(!player.alive)
        camera.draw_untranslated("Start",camera.c.width/2,camera.c.height/2);
}
