pad=new Controller("Player1",{
    "jump":"Space",
    "left":"A",
    "right":"D",
    "up":"W",
    "down":"S",
});
CONFIG={
    LOADFRAMES:120,
    CHARS:{
        "Dot":{
            animframes:{
                "load":1,
                "idle":4,
            }
        }
    },
};
function Player(num,char,x,y,pad){
    this.pad=pad;
    this.num=num;
    this.character=char;
    this.config=CONFIG.CHARS[this.character];
    this.pos=new Point(x,y);
    this.vel=new Point();
    this.setAction({type:"load",img:"load"});
}
Object.assign(Player.prototype,{
    setAction(obj){
        this.action={
            frame:-1,
            anim:-1,
            type:obj.type+"",
            spec:obj.spec+"",
            dir:new Point(obj.dir),
            img:obj.img+"",
        };
    },
    draw(){
        camera.draw(
            [this.character,this.action.type,this.action.anim].join(),
            this.pos.x,
            this.pos.y
        );
    },
    step(){
        this.frame++;
        this.anim++;
        this.anim%=this.config.animframes[this.action.type];
        if(this.action.type=="load"){
            if(this.action.frame>=CONFIG.LOADFRAMES){
                this.setAction({type:"idle","img":"idle"});
            }
        } else if(this.action.type=="idle"){
            if(this.pad.getNewInput("jump")){
                this.setAction({type:"jumpsquat",img:"jumpsquat",spec:"fullhop"});
            }
        } else if(this.action.type=="jumpsquat"){
            if(!this.pad.getInput("jump")){
                this.action.spec="shorthop";
            }
            if(this.action.frame>=this.config.animframes.jumpsquat){
                this.setAction({type:this.action.spec,});
            }
        }
        this.pad.endStep();
    },
    grounded(){

    }
});
