class Polynomial{
    constructor(...a){
        this.values=a;
    }
    set(i,v){
        this[i]=v;
    }
    get(i){
        return this[i]||0;
    }
    add(...p){
        p=new Polynomial(...p);
        v=new Polynomial();
        for(let i=0;i<this.values.length||i<p.values.length;i++)
            v.set(i,math.add(this.get(i),p.get(i)));
        return v;
    }
    subtract(...p){
        p=new Polynomial(...p);
        v=new Polynomial();
        for(let i=0;i<this.values.length||i<p.values.length;i++)
            v.set(i,math.subtract(this.get(i),p.get(i)));
        return v;
    }
    multiply(...p){
        p=new Polynomial(...p);
    }
}

one_plus_i=math.complex("1+i");
two_minus_i=math.complex("2-i");
three=math.add(one_plus_i,two_plus_i);
//Three=one_plus_i+two_plus_i;
Three=one_plus_i.add(two_plus_i);
