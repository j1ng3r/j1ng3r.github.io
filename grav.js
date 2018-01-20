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
        return Object.keys(this).reduce((a,i)=>a+this[i]**2,0);
    }
    getAngleVector(){
        return this.scale(1/this.getMag());
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
        this.p.addS(this.v.scale(d)//.add(this.a.scale(d*d/2))
        );
        if(this.p.getMag2()>R*R){
            this.p.subS(this.p.getAngleVector().scale(2*R));
        }
        return this;
    }
    getV(){
        this.v.addS(this.a.scale(d));
        return this;
    }
    getA(){
        let dif;
        this.a=map.reduce(((a,P)=>
            P==this?a:(dif=this.p.getDist(P.p),a.add(dif.scale(P.m/(dif.getMag2()**1.5))))
        ),new Vector()).scale(G);
        return this;

        //dif=this.p.getDist(P.p);                 return a.add(dif.scale(P.m/(dif.getMag2()**1.5)));
        //dif=V.dist(this.get("pos"),P.get("pos"));return V.add(a,V.scale(dif,P.get("mas")/V.getMag(dif)**3));
    }
    draw(){
        rekt(this.p.x,this.p.y,this.s);
    }
    isColliding(o){
        return(this.s+o.s)**2>this.p.getDist(o.p).getMag2();
    }
}
maxV=0.4;
d=1/16;
G=2;
R=10000;

map=Object.assign([],{
    do(...a){a.forEach(V=>this[V]=_=>this.forEach(v=>v[V](_))||this);},
    step(){this.getA().getV().getD().getP().collide();},
    //step:R.compose(M.collide,M.getP,M.getD,M.getV,M.getA),
    add(m,p,v){
        this.push(new Point(m,p,v));
        return this;
    },
    getD(){
        d=maxV/this.reduce((a,P)=>Math.max(a,P.v.getMag()),0);
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
map.do("getA","getV","getP","draw");
/*map
    .add(400,[0,0],[0,0])
    .add(1,[400,0],[0,2])
    .add(1,[100,0],[0,3]);
;*/
for(let i=0,r,t,v,n=200,D=50;i<n;i++){
    r=Math.sqrt(Math.rand(0,n*D));
    m=Math.rand(0.3,1);
    t=Math.rand(0,2*Math.PI);
    v=Math.sqrt(G*n*m/r);
    map.add(m,[r*Math.cos(t),r*Math.sin(t)],[Math.sin(t)*v,-Math.cos(t)*v]);
}
for(let i=0,r,t,v;i<50;i++){
    r=Math.sqrt(Math.rand(0,1000));
    t=Math.rand(0,2*Math.PI);
    //v=Math.rand(-5,7)*G;
    map.add(Math.rand(0.3,1),[r*Math.cos(t),r*Math.sin(t)],[Math.sin(t)*v/Math.sqrt(r),-Math.cos(t)*v/Math.sqrt(r)]);
}

//You can ignore this
ctx=null;
t={x:0,y:0,s:1};
function rekt(x,y,s){
    ctx.beginPath();
    ctx.arc((x-t.x)/t.s,(y-t.y)/t.s,s/t.s,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    //ctx.fillRect(x-s/2,y-s/2,s,s);
}
function draw(){
    ctx.fillStyle="#000";
    ctx.fillRect(-c.width/2-1,-c.height/2-1,c.width+2,c.height+2);
    ctx.fillStyle="#fff";
    rekt(0,0,R+4);
    ctx.fillStyle="#000";
    rekt(0,0,R);
    ctx.fillStyle="#fff";
    map.draw();
}
function step(){
    map.step();
}
window.onload=function(){
    c.width=window.innerWidth;
    c.height=window.innerHeight;
    ctx=c.getContext('2d');
    ctx.translate(c.width/2,c.height/2);
    interval(step,draw,60);
    document.addEventListener("keydown",function(e){
        if(e.key=="a"){
            t.x-=t.s;
        } else if(e.key=="d"){
            t.x+=t.s;
        } else if(e.key=="w"){
            t.y-=t.s;
        } else if(e.key=="s"){
            t.y+=t.s;
        } else if(e.key=="q"){
            t.s*=1.05;
        } else if(e.key=="e"){
            t.s/=1.05;
        }
    });
};
