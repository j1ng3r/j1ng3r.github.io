//Requires fraction.js
function Polynomial(func,a,b,i){
    this.list=[];
    if(typeof func=='function'){
        for(i=0;i<b;i++)
            this.list.push(new Fraction(i<a?0:func(i)));
    } else if(typeof func=="object"){
        if(func instanceof Polynomial){func=func.list;}
        for(i in func)
            this.list.push(new Fraction(func[i]));
    } else this.list=[new Fraction(func)];
}
Object.assign(Polynomial.prototype,{
    get(i){
        return this.list[i]=this.list[i]||new Fraction(0);
    },
    new(){return new Polynomial(this.list);},
    derivate(){
        for(var i in this.list)
            if(i)this.list[i-1]=this.get(i).new().mul(i);
        return this;
    },
    integrate(){
        var n=[new Fraction];
        for(var i in this.list)
            n[+i+1]=this.get(i).new().div(+i+1);
        this.list=n;
        return this;
    },
    add(p){
        p=new Polynomial(p);
        for(var i in p.list)
            this.list[i]=this.get(i).add(p.list[i]);
        return this;
    },
    sub(p){
        for(var i in p.list)
            this.list[i]=this.get(i).sub(p.list[i]);
        return this;
    },
    mul(p){
        p=new Polynomial(p);
        var n=[],i,j;
        for(i in p.list)
            for(j in this.list)
                n[i- -j]=(n[i- -j]||new Fraction).add(p.list[i].new().mul(this.list[j]));
        this.list=n;
        return this;
    },
    pow(n){
        for(var i=0,d=new Polynomial([1]);i<n;i++)d.mul(this);
        this.list=d.list;
        return this;
    },
    sq(){
        return this.mul(this);
    },
    substitute(p){
        var n=new Polynomial;
        for(var i in this.list)
            n.add(p.new().pow(+i).mul(this.list[i]));
        return n;
    },
    toString(){
        for(var i=1,t=this.list[0].toString();i<this.list.length;i++){
            t+=` + ${this.list[i].toString()}x^${i}`;
        }
        return t;
    }
});
