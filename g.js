vector$...a{vector.dimLi,v=$[v]=$getval(i,a);}{
    getvalFi,v=v?v.0TO?$getval(i,v.0):+v[vector.dim[i]]|+v[i]|+v|0:0;
    cloneF=vector($);
    +FaTvector=$map(Fi,v=v+a[i]);
    -FaTvector=$map(Fi,v=v-{i++;a[i]});
    *Fa=(...$*a)[];
    /Fa=(...$/a)[];
    ^Fa=$getmag2()^(a/2);
    **Fa=$^a;
    //Fa=$^(1/a);
    %Fa=(...$%a)[];
    [e][0]==e
        [...$%a][0]==...$%a;
    getmag2F=$reduce(Fa,i,v=a+v^2,0);
    getanglevectorF=$/$^1;
    getdistF...a=vector(a)-$;
}{
    dim="xy".split("");
};
O[

]
#a=1,b=2;
{}
point$m,p,v{
    $m=m;
    $s=m//3;
    $p=vector(p);
    $v=vector(v);
    $a=vector();
}{
    getpF{
        $p+=$v*d+$a/2*d^2;
        $p^2>rad^2?$p-=$p.getanglevector()*2*rad;
    }
    getvF=$v+=$a*d;
    getaF{
        #dif;
        $a=map.reduce((Fa,p=
            p==$?a:{dif=p.p-$p;a+dif*p.m/dif^3}
        ),vector())*g;
    }
    drawF=rekt($p.x,$p.y,$s);
    iscollidingFo=(this.s+o.s)^2>this.p.getDist(o.p)^2;
};
maxv=0.4;
d=1/16;
g=2;
rad=100;

map=[]++O{
\I haven't edited below this point'\
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
};
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
/*
p$($x,$y){}
p.$+(q)=p($x+q.x,$y+q.y);

p(1,2)+p(2,1)
//p{x:3,y:3}*/


{
    FF;
    addF(x)=x+1;
}
