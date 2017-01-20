function step(){
    if(pad.getInput("refresh"))history.go();
    if(pad.getNewInput("die"))player.alive=0;
    if(player.alive){
        player.step();
		for(var i of Block.all)
			i.step();
        player.endStep();
        chunkify();
	} else {
        if(pad.getNewInput("start")){
            player.setup();
            if(!(Block.all.length&&+localStorage.getItem("willKeep"))){
                Block.last_X=-10;
                Block.last_Y=-1;
                Block.all=[];
                for(var i=0;i<20;i++)addChunk(0);
                chunkify();
            }
        }
        if(pad.getNewInput("state"))
            localStorage.setItem("willKeep",1-localStorage.getItem("willKeep"));
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
    camera.background("#"+"0".repeat(6-a.toString(16).length)+a.toString(16));
	for(var i of Block.all)
		i.draw();
	player.draw();
    if(!player.alive){
        camera.pause();
        camera.draw("Start",camera.c.width/2,camera.c.height/2) ;
        camera.resume();
    }
        camera.draw_untranslated();
}
