function phi(r,p){
	if(r instanceof phi){
		this.reg=r.reg;
		this.phi=r.phi;
    } else {
		this.reg=r;
		this.phi=p;
    }
}
Object.assign(phi.prototype,{
    add(r,p){
        r=new phi(r,p);
        return new phi(this.reg+r.reg,this.phi+r.phi);
    },
    multiply(r,p){
    	r=new phi(r,p);
    	var a=this;
    	return new phi(a.reg*r.reg+a.phi*r.phi,a.phi*r.phi+a.phi*r.reg+r.phi*a.reg);
    }
});
