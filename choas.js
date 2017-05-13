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
    avg(){
        return this.add(arguments).scale(1/2);
    }
}
Vector.dim="xy".split("");
var endpoints=Object.assign([],{
    add(x,y){
        this.push(new Vector(x,y));
        return this;
    }
}),points=[new Vector(0,0)];
function step(){
    points.unshift(points[0].avg(Math.rand(endpoints)));
}
function draw(){
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle="#fff";
    for(let i=0;i<points.length;i++){
        ctx.fillRect(points[i].x,points[i].y,r,r);
    }
}
r=1;
window.onload=function(){
    c.width=window.innerWidth;
    c.height=window.innerHeight;
    ctx=c.getContext('2d');
    interval(step,draw,2000);
    endpoints
        .add(Math.rand(c.width),Math.rand(c.height))
        .add(Math.rand(c.width),Math.rand(c.height))
        .add(Math.rand(c.width),Math.rand(c.height))
    ;
};
