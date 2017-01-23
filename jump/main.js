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
    setup(){
        localStorage.setItem("hiscore",Math.max(+this.score||0,+localStorage.getItem("hiscore")||0));
        this.alive=1;
        this.XtraScore=0;
        this.score=0;
        this.pos=new Point(this.POS);
        this.poses=[];
        this.vel=new Point(Number.eval(this.VEL,this.pos.x),0);
        this.setAction("run");
    },
    grav(a){
        this.vel.y-=a;
        if(this.action=="fall"){
            if(this.vel.y<-this.FFTERMVEL)this.vel.y=-this.FFTERMVEL;
        } else if(this.vel.y<-this.TERMVEL)this.vel.y=-this.TERMVEL;
    },
    land(){
        if(!this.canfall.includes(this.action))this.setAction("run");
    },
    kill(){
        this.alive=false;
        this.vel=new Point();
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
        var VEL=Number.eval(this.VEL,this.pos.x);
    	switch(this.action){
			case"run":
                this.vel.x=VEL;
                if(pad.getNewInput("dash")){
                    this.setAction("gdash");
                } else if(pad.getInput("jump")){
                    this.XtraScore+=this.SCORE.JUMP;
                    this.vel.y=this.JUMP;
                    this.setAction("air");
                }
				break;
            case"gdashend":
                if(this.frame<this.frames.gdash[0])this.vel.x=VEL*Math.pow(this.GDASHMULT,1-this.frame/this.frames.gdash[0]);
                else this.setAction("run");
                break;
            case"gdash":
                if(pad.getInput("dash")){
                    this.XtraScore+=this.SCORE.GDASH;
                    this.vel.x=VEL*this.GDASHMULT;
                } else this.setAction("gdashend");
                break;
            case"air":
                this.vel.x=VEL;
                if(pad.getNewInput("fall"))this.setAction("fall");
                else if(pad.getNewInput("dash"))this.setAction("dash");
                else if(pad.getInput("jump"))this.grav(this.GRAV*this.FLOATSCALE);
                else this.grav(this.GRAV);
                break;
            case"fall":
                if(pad.getInput("fall"))this.vel.y-=this.FF;
                if(pad.getNewInput("dash"))this.setAction("dash");
                else this.grav(this.GRAV);
                break;
            case"dash":
                if(this.frame<this.frames.dash[0]){
                    this.XtraScore+=this.SCORE.DASH;
                    this.vel.x=VEL*this.DASHMULT;
                } else if(this.frame<this.frames.dash[1]){
                    this.vel.x=VEL*Math.pow(this.DASHMULT,(this.frames.dash[1]-this.frame)/(this.frames.dash[1]-this.frames.dash[0]));
                    this.grav(this.GRAV);
                } else this.setAction("air");
                break;
		}
        if(this.canfall.includes(this.action))this.grav(this.GRAV);
        this.score=Math.floor(this.pos.x/50+this.XtraScore);
    }
};
+function setSize(s){
    player.size=s;
    pad.preventDefault();
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
