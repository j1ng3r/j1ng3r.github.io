camera.setCanvas(document.createElement("canvas"));
function dimensionCanvas(){
    camera.setCanvasDimensions(window.innerWidth,window.innerHeight);
}
window.onresize=dimensionCanvas;
localStorage.setItem("willKeep",+localStorage.getItem("willKeep"));
var pad=new Controller("a",{
	"start":"Left Arrow|Space|Pad0Button0",
	"jump":"Up Arrow|Space|Pad0Button3",
	"dash":"Right Arrow|Pad0Button1",
	"fall":"Down Arrow|Pad0Button2",
    "refresh":"R",
    "state":"E",
    "die":"Q"
}),player={
    alive:0,
    poses:[],
    canfall:["run","gdash"],
    curvel:0,
    setup(){
        localStorage.setItem("hiscore",Math.max(+this.score||0,+localStorage.getItem("hiscore")||0));
        this.alive=1;
        this.XtraScore=0;
        this.score=0;
        this.pos=new Point(this.POS);
        this.poses=[];
        this.mov=new Point(1,0);
        this.setAction("run");
    },
    grav(a){
        this.mov.y-=a*this.curvel;
        if(this.action=="fall"){
            if(this.mov.y<-this.FFTERMVEL)this.mov.y=-this.FFTERMVEL;
        } else if(this.mov.y<-this.TERMVEL)this.mov.y=-this.TERMVEL;
    },
    land(){
        if(!this.canfall.includes(this.action))this.setAction("run");
    },
    kill(){
        this.alive=false;
        this.mov=new Point();
    },
    setAction(a){
        this.action=""+a;
        this.frame=0;
    },
    draw(){
        for(var i=this.maxPoses,a,b=this.score.toString(),c="hi "+localStorage.getItem("hiscore");i>=0;i--)
            if(a=this.poses[i*this.posLength]){
                camera.ctx.globalAlpha=1-i/this.maxPoses;
                camera.draw(this.alive||i?"player":"dead",a.x,a.y);
            }
        for(i in b)
            camera.draw_untranslated(b[i],(i-b.length)*70+camera.c.width-20,camera.c.height-80);
        for(i in c)
            camera.draw_untranslated(c[i],(i-c.length)*70+camera.c.width-20,camera.c.height-200);
	},
    endStep(){
        this.poses.unshift(new Point(this.pos.addS(this.vel)));
        if(this.poses.length>this.maxPoses*this.posLength)this.poses.pop();
        if(this.canfall.includes(this.action)&&this.vel.y<0)this.setAction("air");
    },
    step(){
        this.frame++;
        this.curvel=Number.eval(this.VEL,this.pos.x);
        var FRAMES={},i,j;
        for(i in this.frames){
            FRAMES[i]=[];
            for(j in this.frames[i])
                FRAMES[i][j]=Math.floor(this.frames[i][j]/this.curvel);
        }
    	switch(this.action){
			case"run":
                this.mov.x=1;
                if(pad.getNewInput("dash")){
                    this.setAction("gdash");
                } else if(pad.getInput("jump")){
                    this.XtraScore+=this.SCORE.JUMP;
                    this.mov.y=this.JUMP;
                    this.setAction("air");
                }
				break;
            case"gdashend":
                if(this.frame<FRAMES.gdash[0])this.mov.x=Math.pow(this.GDASHMULT,1-this.frame/FRAMES.gdash[0]);
                else this.setAction("run");
                break;
            case"gdash":
                if(pad.getInput("dash")){
                    this.XtraScore+=this.SCORE.GDASH*this.curvel;
                    this.mov.x=this.GDASHMULT;
                } else this.setAction("gdashend");
                break;
            case"air":
                this.mov.x=1;
                if(pad.getNewInput("fall"))this.setAction("fall");
                else if(pad.getNewInput("dash"))this.setAction("dash");
                else if(pad.getInput("jump"))this.grav(this.GRAV*this.FLOATSCALE);
                else this.grav(this.GRAV);
                break;
            case"fall":
                if(pad.getInput("fall"))this.mov.y-=this.FF;
                if(pad.getNewInput("dash"))this.setAction("dash");
                else this.grav(this.GRAV);
                break;
            case"dash":
                if(this.frame<FRAMES.dash[0]){
                    this.XtraScore+=this.SCORE.DASH*this.curvel;
                    this.mov.x=this.DASHMULT;
                } else if(this.frame<FRAMES.dash[1]){
                    this.mov.x=Math.pow(this.DASHMULT,(FRAMES.dash[1]-this.frame)/(FRAMES.dash[1]-FRAMES.dash[0]));
                    this.grav(this.GRAV);
                } else this.setAction("air");
                break;
		}
        if(this.canfall.includes(this.action))this.grav(this.GRAV);
        this.score=Math.floor(this.pos.x/50+this.XtraScore);
        this.vel=this.mov.scale(this.curvel);
    }
};
+function setSize(s){
    player.size=s;
    pad.preventDefault("WhiteList",["LControl","F11"]);
    dimensionCanvas();
    camera.flipAxis("y");
    camera.RGB=[255,255,255];
    camera.RGB[Math.floor(Math.rand(0,3))]=0;
    camera.createSprite("dead",`jump/sprites/dead${s}.png`);
    camera.createSprite("Start","jump/sprites/start.png");
    camera.createSprite("player",`jump/sprites/player${s}.png`);
    for(var i of "1234567890-hi")
        camera.createSprite(i,`jump/sprites/number_${i}.png`);
}(40);
