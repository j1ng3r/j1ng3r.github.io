function draw(){
    camera.background(`rgb(${camera.RGB[0]},${camera.RGB[1]},${camera.RGB[2]})`);
    camera.textAlign("center");
    camera.draw("dl",0,0);
    camera.font("bold 60px Roboto");
    camera.fill("#fff");
    camera.drawRect(5500,0,400,camera.c.height);
    camera.drawText("POL BY\nMarcus",0,470);
    camera.fill("#000");
    camera.drawRect(5900,-1,camera.c.width,camera.c.height);
    camera.drawRect(-1400,-1,-camera.c.width,camera.c.height);
    camera.font("50px Ubuntu");
    camera.drawText("I learned stuff\nHere's a presentation",0,150);
    camera.drawText("Go that way\n  ->",-1200,300);
    camera.font("70px Ubuntu");
    camera.textAlign("left");
    camera.drawText("Semester...Start!",900,400);
    camera.drawText("I've changed into a...",4500,500)
    //camera.draw("start",1300,400);
    camera.font("40px Ubuntu");
    camera.drawText([
        "Introvert",
        "  \u2022 I avoided being in charge of other people.",
        "",
        "Programmer",
        "  \u2022 I always went with the first idea."
    ],900,300);
    camera.drawText(
`Leader
  \u2022 In the Toy Shop Design Lab, I became the leader
of my group, and I guided my team to success.

Rethinker
 \u2022 In the CS Design Lab, I learned to test lots of
alternative ideas rather than sticking with the first.`,4500,400);
    camera.draw("POL",2800,-150);
    camera.draw("box",2800,0);
    camera.draw("plant",5700,100);
    /**/
    camera.draw("player"+player.dir,player.pos.x,player.pos.y);
    camera.pause();
    camera.drawRect(0,0,camera.c.width,camera.c.height*player.PERC);
    camera.resume();
    camera.textAlign("center");
    camera.fill("#fff");
    camera.font("60px Roboto");
    camera.drawText(
        player.TIMETEXT[Math.floor((Date.now()-player.time)/player.TIME)%player.TIMETEXT.length]
    ,0,-60);
}
camera.setCanvas(document.createElement("canvas"));
camera.createSpritesFromFolder("pol/sprites/",[
    "player1",
    "player-1",
    "box",
    "test",
    "dot",
    "dl",
    "plant",
    "POL",
    "start"
],".png");
camera.flipAxis("y");
//camera.ctx.imageSmoothingEnabled=camera.ctx.mozImageSmoothingEnabled=camera.ctx.webkitImageSmoothingEnabled=false;
camera.RGB=[255,255,255];
camera.RGB[Math.floor(Math.rand(0,3))]=0;
function dimensionCanvas(){
    camera.setCanvasDimensions(window.innerWidth,window.innerHeight);
}
window.onresize=dimensionCanvas;
dimensionCanvas();
pad=new Controller("pol",{
    "right":"Right Arrow",
    "left":"Left Arrow",
    "jump":"Up Arrow|Space",
    "r":"R"
});
pad.preventDefault();
player={
    pos:new Point(0,100),
    GRAV:0.5,
    GFRIC:0.95,
    AFRIC:0.98,
    GVEL:17,
    AVEL:9,
    JUMPS:2,
    jumps:0,
    JUMPVEL:15,
    vel:new Point(),
    PERC:1/6,
    size:30,
    dir:1,
    time:Date.now(),
    TIME:2000,
    TIMETEXT:[
        "Move with the Arrow Keys",
        "Jump with Up Arrow or Space",
        "Go right to Explore"
    ],
    move(dir,n){
        this.vel.x+=dir*this[n+"VEL"]*(1-this[n+"FRIC"]);
    },
    step(){
        var DIR=pad.getInput("right")-pad.getInput("left");
        if(this.pos.y==this.size&&!this.vel.y){
            this.jumps=this.JUMPS;
            this.vel.scaleS(this.GFRIC).addS(0,this.JUMPVEL*pad.getNewInput("jump"));
            this.move(DIR,"G");
            this.dir=DIR||this.dir;
        } else {
            this.vel.scaleS(this.AFRIC).subS(0,this.GRAV);
            this.move(DIR,"A");
            if(pad.getNewInput("jump")&&this.jumps){
                this.jumps--;
                this.vel.y=this.JUMPVEL;
                this.dir=DIR||this.dir;
            }
            if(this.pos.y+this.vel.y<=this.size){
                this.pos.y=this.size;
                this.vel.y=0;
            }
        }
        if(this.pos.x+this.vel.x>=5900-this.size){
            this.pos.x=5900-this.size;
            this.vel.x=0;
        }
        if(this.pos.x+this.vel.x<=this.size-1400){
            this.pos.x=this.size-1400;
            this.vel.x=0;
        }
        this.pos.addS(this.vel);
    }
};
function step(){
    if(pad.getInput("r"))history.go();
    player.step();
    camera.setCamera(player.pos.x-camera.c.width/2,-camera.c.height*player.PERC);
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
    }
    camera.RGB=[R,G,B];
    pad.endStep();
}
interval(step,draw,60);
window.onload=function(){
    camera.setCenterPercent({
        x:0.5,
        y:1
    });
    camera.setCenterPercent("player1",{x:0.5,y:0.5});
    camera.setCenterPercent("player-1",{x:0.5,y:0.5});
    camera.setCenterPercent("box",{x:1,y:1});
    camera.setCenterPercent("POL",{x:0,y:1});
    document.body.appendChild(camera.c);
};
