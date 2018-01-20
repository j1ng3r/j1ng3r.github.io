class Box {
    constructor(p,w,o){
        Object.assign(this,o);
        this.p = new Vector(p);
        this.w = new Vector(w);
    }
    step(){
        console.log("Step:",this);
    }
    collide(b){
        let s={E:0,W:0,N:0,S:0};
        let _=(a,b,c)=>a<=c&&c<=a+b;
        if(_(b.p.x,b.w.x,this.p.x+this.w.x)){
            s.E=1;
        }
        if(_(this.p.x,this.w.x,b.p.x+b.w.x)){
            s.W=1;
        }
        if(_(b.p.y,b.w.y,this.p.y+this.w.y)){
            s.S=1;
        }
        if(_(this.p.y,this.w.y,b.p.y+b.w.y)){
            s.N=1;
        }
        return s;
    }
    draw(){
        console.log("Draw:",this);
    }
}