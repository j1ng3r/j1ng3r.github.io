class Vector{
    constructor(...a){
        if(!this)return new Vector(...a);
        a=Array.flatten(a);
        this.set.apply(this,Vector.parse(a));
    }
    set(...a){
        a.forEach((v,i)=>this[Vector.dim[i]]=+v||this[Vector.dim[i]]||0);
    }
    clone(){
        return new Vector(this);
    }
	add(...a){
        return new Vector(...a).map((v,i)=>v+this[i]);
	}
	sub(...a){
		return new Vector(...a).map((v,i)=>v-this[i]);
	}
	scale(a=1){
		return this.map((v,i)=>v*a);
    }
	div(a=1){
		return this.scale(1/a);
	}
	rotate(theta){
		var x=Math.cos(theta),y=Math.sin(theta);
		return new Vector(
			this.x*x-this.y*y,
			this.y*x+this.x*y
        );
    }
    dot(...a){
        a=new Vector(...a);
        return Vector.dim.reduce((a,v)=>a+this[v]*a[v],0);
    }
    magnitude(){
        return Math.sqrt(this.dot(this));
    }
	dist(...a){
		return this.sub(...a).magnitude();
    }
}
Object.assign(Vector,{
    dim:"xyz".split(""),
    alternate:["width","height","depth"],
    parse:a=>Vector.dim.map((v,i)=>a[i]||a[v]||Vector.alternate[i]),
    zero:new Vector(),
    one:new Vector(1,1,1),
    map:(v,fn)=>Vector.dim.reduce((a,i)=>Object.assign(a,{[i]:fn(v[i],i,v)}),new Vector()),
});
