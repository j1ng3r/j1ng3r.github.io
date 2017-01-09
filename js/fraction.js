//Requires expand.js
function Fraction(n,d){
	"use strict";
	if(!this)return new Fraction(n,d);
    if(Number.isNaN(n)){
        this.n=n;
        this.d=n;
    }
	if(typeof n=='object')
		this.set(n.n||n[0]||n.x||n.width,n.d||n[1]||n.y||n.height);
	else this.set(n,d);
}
Object.assign(Fraction.prototype,{
	set(n,d){
	    this.n=+n||0;
	    this.d=+d||1;
	},
	new(){
	    return new Fraction(this);
	},
	add(n,d){
		n=new Fraction(n,d);
	    this.n=this.n*n.d+this.d*n.n;
	    this.d*=n.d;
	    return this.simplify();
	},
	sub(n,d){
		n=new Fraction(n,d);
	    this.n=this.n*n.d-this.d*n.n;
	    this.d*=n.n;
	    return this.simplify();
	},
	mul(n,d){
		n=new Fraction(n,d);
		this.n*=n.n;
	    this.d*=n.d;
	    return this.simplify();
	},
	div(n,d){
		n=new Fraction(n,d);
	    this.n*=n.d;
	    this.d*=n.n;
	    return this.simplify();
	},
	inv(){
		[this.n,this.d]=[this.d,this.n];
		return this;
	},
	sq(){
		return this.mul(this);
	},
	eval(){return this.n/this.d;},
	simplify(){
		for(var n=Math.factor(this.n),d=Math.factor(this.d),i=0;i<n.length;i++)
	    	if(d.includes(n[i])){
	        	d.splice(d.indexOf(n.splice(i,1)[0]),1);
	            i--;
	        }
       	if(d.includes(-1)){
           	d.splice(d.indexOf(-1),1);
           	n.push(-1);
       	}
       	this.n=1;
       	this.d=1;
       	for(i of n)this.n*=i;
       	for(i of d)this.d*=i;
       	return this;
   	},
   	toString(){
	  	return this.simplify().n+(this.d==1?"":'/'+this.d);
	}
});
