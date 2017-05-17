class Vector {
    constructor(){
        for(let i=0;i<Vector.dim.length;i++){
            this[Vector.dim[i]]=this.getValue(arguments,i);
        }
    }
    getValue(v,i){
        if(!v)return 0;
        if(typeof v[0]=="object"){
            return this.getValue(v[0],i);
        } else return+v[Vector.dim[i]]||+v[i]||+v||0;
    }
    clone(){
        return new Vector(this);
    }
    add(){
        for(var i=0,v=new Vector(arguments),r=new Vector();i<Vector.dim.length;i++)r[Vector.dim[i]]=this[Vector.dim[i]]+v[Vector.dim[i]];
        return r;
    }
    addS(){
        for(var i=0,v=new Vector(arguments);i<Vector.dim.length;i++)this[Vector.dim[i]]+=v[Vector.dim[i]];
        return this;
    }
    sub(){
        for(var i=0,v=new Vector(arguments),r=new Vector();i<Vector.dim.length;i++)r[Vector.dim[i]]=this[Vector.dim[i]]-v[Vector.dim[i]];
        return r;
    }
    subS(){
        for(var i=0,v=new Vector(arguments);i<Vector.dim.length;i++)this[Vector.dim[i]]-=v[Vector.dim[i]];
        return this;
    }
    scale(s){
        for(var i=0,v=new Vector(arguments),r=new Vector();i<Vector.dim.length;i++)r[Vector.dim[i]]=this[Vector.dim[i]]*s;
        return r;
    }
    scaleS(s){
        for(var i=0;i<Vector.dim.length;i++)this[Vector.dim[i]]*=s;
        return this;
    }
    getMag(){
        return Math.sqrt(this.getMag2());
    }
    getMag2(){
        for(var sum=0,i=0;i<Vector.dim.length;i++)
            sum+=this[Vector.dim[i]]**2;
        return sum;
    }
    getDist(){
        return(new Vector(arguments)).sub(this);
    }
}
Vector.dim="xy".split("");
class Point {
    constructor(m,p,v){
        this.m=m;
        this.s=Math.pow(m,1/3);
        this.p=new Vector(p);
        this.v=new Vector(v);
        this.a=new Vector();
    }
    getP(){
        this.p.addS(this.v.scale(d).add(this.a.scale(d/2)));
        return this;
    }
    getV(){
        this.v.addS(this.a.scale(d));
        return this;
    }
    getA(){
        if(!this.n)this.n=0;
        this.n--;
        this.a=new Vector();
        for(let i=0,mag,dif,unit;i<map.length;i++)if(map[i]!=this){
            dif=this.p.getDist(map[i].p);
            mag=map[i].m/dif.getMag2();
            unit=dif.scale(mag/dif.getMag());
            this.a.addS(unit);
        }
        this.a.scaleS(G);
        return this;
    }
    draw(){
        rekt(this.p.x,this.p.y,this.s);
    }
    isColliding(o){
        return(this.s+o.s)**2>this.p.getDist(o.p).getMag2();
    }
}
maxV=6;
d=1/16;
G=3;
map=Object.assign([],{
    do(a){this[a]=_=>{for(var i=0;i<this.length;i++)this[i][a](_);return this;}},
    step(_){this.time().getA().getV().getD().getP().timeEnd().time().collide().timeEnd();},
    add(m,p,v){
        this.push(new Point(m,p,v));
        return this;
    },
    getD(){
        d=maxV/this.reduce((a,v)=>Math.max(a,v.v.getMag()))/16;
        return this;
    },
    collide(){
        for(var i=0,I,j,J,M;i<this.length;i++){
            for(j=i+1;j<this.length;j++){
                if(this[i].isColliding(this[j])){
                    J=this.splice(j,1)[0];
                    I=this[i];
                    M=I.m+J.m;
                    this[i]=new Point(
                        M,
                        I.p.scale(I.m).add(J.p.scale(J.m)).scale(1/M),
                        I.v.scale(I.m).add(J.v.scale(J.m)).scale(1/M)
                    );
                    j=i+1;
                }
            }
        }
        return this;
    },
    time(){
        console.time();
        return this;
    },
    timeEnd(){
        console.timeEnd();
        return this;
    }
});
map.do("getA");
map.do("getV");
map.do("getP");
map.do("draw");
map
//    .add(2000,[0,0],[0,0])
;
for(let i=0,r,t,v;i<2000;i++){
    r=Math.sqrt(Math.rand(0,100000));
    t=Math.rand(0,2*Math.PI);
    v=Math.rand(-5,7);
    map.add(Math.rand(0.3,1),[r*Math.cos(t),r*Math.sin(t)],[Math.sin(t)*v,-Math.cos(t)*v]);
}

//You can ignore this
ctx=null;
function rekt(x,y,s){
    ctx.beginPath();
    ctx.arc(x,y,s,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    //ctx.fillRect(x-s/2,y-s/2,s,s);
}
function draw(){
    ctx.fillStyle="#000";
    rekt(0,0,c.width,c.height);
    ctx.fillStyle="#fff";
    map.draw();
    for(var i=-100;i<=100;i+=10){
        for(var j=-100;j<=100;j+=10){
            //rekt(i,j,1);
        }
    }
}
window.onload=function(){
    c.width=window.innerWidth;
    c.height=window.innerHeight;
    ctx=c.getContext('2d');
    ctx.translate(c.width/2,c.height/2);
    interval(map.step.bind(map),draw,60);
};
